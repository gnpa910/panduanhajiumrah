#!/usr/bin/env tsx
/**
 * Citation linter (PAN-10).
 *
 * For every guide MDX/MD file:
 *   1. Parse frontmatter sources block
 *   2. Validate every source URL is in the whitelist (src/data/whitelist-sumber.ts)
 *   3. Verify source URLs are reachable (HTTP HEAD, fallback GET)
 *   4. With --flip, set factChecked:true + factCheckedAt + factCheckedBy
 *
 * Failures exit non-zero — wired into VPS pre-deploy step.
 *
 * Usage:
 *   tsx tools/citation-linter.ts                    # lint with live URL check
 *   tsx tools/citation-linter.ts --no-live          # offline (whitelist only)
 *   tsx tools/citation-linter.ts --flip             # also flip factChecked
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { isWhitelistedSource } from "../src/data/whitelist-sumber.js";

interface Result {
  file: string;
  pass: boolean;
  errors: string[];
}

const GUIDE_DIR = "src/content/guide";
const FACT_CHECKER_TAG = "Fact-checker (automated linter)";
const SKIP_FILE_PATTERN = /contoh-skema/;

function parseSources(rawFm: string): { url: string; label: string }[] {
  const sources: { url: string; label: string }[] = [];
  const startIdx = rawFm.search(/^sources:\s*$/m);
  if (startIdx === -1) return sources;

  // Take everything from the line after "sources:" until next zero-indent key
  const after = rawFm.slice(startIdx).split("\n").slice(1);
  const block: string[] = [];
  for (const line of after) {
    if (/^[A-Za-z]/.test(line)) break; // hit next top-level key
    block.push(line);
  }

  // Each item starts with leading-space dash
  const items = block.join("\n").split(/\n\s*-\s+/).map((s) => s.trim()).filter(Boolean);
  for (const item of items) {
    const urlMatch = item.match(/url:\s*["']?([^"'\r\n]+)["']?/);
    const labelMatch = item.match(/label:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
    if (urlMatch) {
      sources.push({
        url: urlMatch[1].trim(),
        label: (labelMatch?.[1] ?? "").trim(),
      });
    }
  }
  return sources;
}

function extractFrontmatter(content: string): string | null {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}

async function findFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(d: string) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name.endsWith(".mdx") || e.name.endsWith(".md")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    let res: Response;
    try {
      res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
      // Some servers return 405 for HEAD — fall through to GET
      if (res.status === 405 || res.status === 403) {
        res = await fetch(url, {
          method: "GET",
          signal: ctrl.signal,
          headers: { Range: "bytes=0-0" },
        });
      }
    } catch {
      res = await fetch(url, {
        method: "GET",
        signal: ctrl.signal,
        headers: { Range: "bytes=0-0" },
      });
    }
    clearTimeout(t);
    return { ok: res.status < 400, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function lintFile(
  file: string,
  opts: { liveCheck: boolean }
): Promise<Result> {
  const content = await readFile(file, "utf-8");
  const rawFm = extractFrontmatter(content);
  const errors: string[] = [];

  if (!rawFm) {
    return { file, pass: false, errors: ["No frontmatter found"] };
  }

  const sources = parseSources(rawFm);
  if (sources.length === 0) {
    errors.push("No sources cited (schema requires min 1)");
  }

  for (const s of sources) {
    if (!isWhitelistedSource(s.url)) {
      errors.push(`Source URL not whitelisted: ${s.url} (label: "${s.label}")`);
    }
    if (opts.liveCheck && isWhitelistedSource(s.url)) {
      const r = await checkUrl(s.url);
      if (!r.ok) {
        errors.push(`Source URL unreachable (HTTP ${r.status}): ${s.url}`);
      }
    }
  }

  return { file, pass: errors.length === 0, errors };
}

async function flipFactChecked(file: string): Promise<void> {
  const content = await readFile(file, "utf-8");
  const today = new Date().toISOString().slice(0, 10);
  let fm = extractFrontmatter(content);
  if (!fm) return;
  const body = content.slice(content.indexOf("---", 3) + 3);

  // Replace or add factChecked
  if (/^factChecked:\s*(true|false)\s*$/m.test(fm)) {
    fm = fm.replace(/^factChecked:.*$/m, "factChecked: true");
  } else {
    fm = fm + `\nfactChecked: true`;
  }
  if (/^factCheckedAt:/m.test(fm)) {
    fm = fm.replace(/^factCheckedAt:.*$/m, `factCheckedAt: ${today}`);
  } else {
    fm = fm + `\nfactCheckedAt: ${today}`;
  }
  if (/^factCheckedBy:/m.test(fm)) {
    fm = fm.replace(/^factCheckedBy:.*$/m, `factCheckedBy: "${FACT_CHECKER_TAG}"`);
  } else {
    fm = fm + `\nfactCheckedBy: "${FACT_CHECKER_TAG}"`;
  }

  await writeFile(file, `---\n${fm}\n---${body}`);
}

async function main() {
  const args = process.argv.slice(2);
  const liveCheck = !args.includes("--no-live");
  const flip = args.includes("--flip");
  const verbose = args.includes("-v");

  const files = await findFiles(GUIDE_DIR);
  console.log(`Linting ${files.length} guide file(s)…`);
  if (!liveCheck) console.log(`  (offline mode — skipping live URL reachability)`);
  console.log("");

  let totalFails = 0;
  for (const file of files) {
    const r = await lintFile(file, { liveCheck });
    const status = r.pass ? "✓" : "✗";
    console.log(`${status} ${r.file}`);
    if (!r.pass) {
      totalFails++;
      for (const e of r.errors) console.log(`    ${e}`);
    } else if (flip && !SKIP_FILE_PATTERN.test(file)) {
      await flipFactChecked(file);
      if (verbose) console.log(`    → flipped factChecked: true`);
    }
  }

  console.log("");
  if (totalFails === 0) {
    console.log(`All ${files.length} file(s) pass citation linter.`);
    process.exit(0);
  } else {
    console.log(`${totalFails} file(s) failed citation lint.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Linter crashed:", e);
  process.exit(2);
});
