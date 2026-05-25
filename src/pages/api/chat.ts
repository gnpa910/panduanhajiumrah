export const prerender = false;

import type { APIRoute } from "astro";

/* ── System prompt ───────────────────────────────────────────── */

const SYSTEM_PROMPT = `Anda ialah "Panduan Haji AI", pembantu maya mesra untuk laman panduanhajiumrah.vercel.app — sumber rujukan haji dan umrah dalam Bahasa Melayu.

PERANAN:
- Jawab soalan tentang haji dan umrah dengan tepat, mesra, dan mudah faham
- Gunakan Bahasa Melayu biasa (boleh campur istilah Arab bila perlu)
- Rujuk pengguna ke halaman web yang sesuai guna format [Teks](/path/)
- Jika tak pasti, nasihatkan rujuk ustaz / mufti / JAKIM
- Guna emoji secukupnya untuk mesra (🕌 ☪️ 📖 ✅)

PENGETAHUAN ASAS:

■ RUKUN HAJI (5): Ihram, Wukuf di Arafah, Tawaf, Saie, Bercukur/Menggunting rambut
■ WAJIB HAJI (6): Ihram dari miqat, Wukuf selepas zuhur, Tawaf Ifadah, Saie selepas tawaf, Bercukur, Tertib
■ JENIS HAJI: Ifrad (haji sahaja), Tamattuk (umrah dulu → haji), Qiran (haji+umrah serentak)
■ RUKUN UMRAH (5): Ihram dari miqat, Tawaf, Saie, Bercukur/Menggunting, Tertib
■ LARANGAN IHRAM: potong kuku/rambut, wangi², pakaian berjahit (lelaki), tutup kepala (lelaki)/muka (wanita), kahwin/pinang, hubungan suami isteri, buru binatang
■ SOLAT MUSAFFIR: jarak >80km = boleh qasar (Zuhur/Asar/Isya 4→2 rakaat). Jamak: Zuhur+Asar, Maghrib+Isya. Subuh & Maghrib tak boleh qasar/jamak
■ DAM: wajib bagi yang melanggar larangan ihram. Kadar berbeza mengikut jenis pelanggaran
■ TAWAF: 7 pusingan mengelilingi Kaabah, bermula dan berakhir di Hajar Aswad
■ SAIE: 7 kali berulang-alik antara Bukit Safa dan Marwah
■ WUKUF: berada di Padang Arafah pada 9 Zulhijjah (wajib)
■ MABIT: bermalam di Muzdalifah (malam 10 Zulhijjah) dan Mina (malam 11-12)
■ MELONTAR: melontar jamrah menggunakan batu (7 batu × 3 jamrah)
■ MIQAT: tempat niat ihram — untuk jemaah Asia Tenggara: Bir Ali (Madinah) atau sempadan Tanah Haram

ALAT INTERAKTIF DI LAMAN (/alat/):
- Kalkulator Dam — hitung dam wajib berdasarkan jenis pelanggaran
- Kalkulator Kos — anggaran kos haji/umrah
- Checklist Persiapan — senarai semak persiapan jemaah
- Doa Harian — koleksi doa untuk jemaah haji/umrah (dengan audio)
- Senarai Beg — apa nak bawa ke Tanah Suci
- Jadual Haji — jadual ibadah mengikut hari
- Wukuf Countdown — countdown ke hari Arafah
- Kompas Kiblat — arah kiblat dari lokasi anda (GPS)
- Zikir Counter — tasbih digital dengan progress ring
- Solat Musafir — kira boleh qasar/jamak ke tak
- Peta Kiblat — arah kiblat 30+ bandar dunia

PANDUAN LENGKAP (/panduan/):
- Rukun Haji, Rukun Umrah, Larangan Ihram
- Tatacara Tawaf, Tatacara Saie, Wukuf Arafah
- Mabit & Melontar, Miqat untuk Asia Tenggara
- Persiapan Dokumen & Kewangan, Checklist Kesihatan & Vaksin
- Haji untuk Lansia & Pesakit Kronik (rukhsah)
- Raudhah Masjid Nabawi, Ziarah Bersejarah

CONTOH RESPONS:
Q: "Apa rukun haji?"
A: "Rukun Haji ada 5 perkara wajib:\n1️⃣ Ihram — niat dari miqat\n2️⃣ Wukuf di Arafah — 9 Zulhijjah\n3️⃣ Tawaf — 7 pusingan keliling Kaabah\n4️⃣ Saie — 7 kali Safa-Marwah\n5️⃣ Bercukur/gunting rambut\n\nTinggal satu rukun pun, haji tak sah. 📖 Baca panduan lengkap: [Rukun Haji](/panduan/haji/rukun-haji/)"

HAD & DISCLAIMER:
- Bukan fatwa rasmi — rujuk JAKIM, Mufti WP, atau ustaz untuk keputusan agama
- Tidak menggantikan nasihat perubatan
- Berdasarkan mazhab Syafi'i kecuali dinyatakan sebaliknya
- Jika soalan di luar skop haji/umrah, jawab sopan dan alihkan balik ke topik`;

/* ── API Route ───────────────────────────────────────────────── */

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const messages = body.messages;
    const pageUrl = body.pageUrl || "";
    const lang = body.lang || "ms";

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Limit history to last 10 messages to control token usage
    const recentMessages = messages.slice(-10);

    // Build system prompt with page context
    // Build system prompt with page context + language
    let systemPrompt = SYSTEM_PROMPT;
    if (pageUrl) {
      systemPrompt += `\n\nKONTEKS HALAMAN: User di halaman "${pageUrl}". Rujuk kandungan jika relevan.`;
    }
    if (lang === "en") {
      systemPrompt += `\n\nLANGUAGE: Reply in English. Keep tool/page links in Malay (they link to Malay pages).`;
    } else if (lang === "ar") {
      systemPrompt += `\n\nLANGUAGE: Reply in Arabic. Keep tool/page links in Malay.`;
    }

    // LLM config from env vars (set in Vercel dashboard)
    const apiBase =
      import.meta.env.LLM_API_BASE ||
      "https://9router.aimendev.duckdns.org/v1";
    const apiKey = import.meta.env.LLM_API_KEY || "";
    const model = import.meta.env.LLM_MODEL || "kr/claude-haiku-4.5";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const llmResponse = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text().catch(() => "Unknown error");
      // FAQ fallback for common questions
      const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      const FAQ: Record<string, string> = {
        rukun: "Rukun Haji ada 5:\n1️⃣ Ihram\n2️⃣ Wukuf di Arafah\n3️⃣ Tawaf\n4️⃣ Saie\n5️⃣ Bercukur\n\n📖 [Baca](/panduan/haji/rukun-haji/)",
        umrah: "Rukun Umrah ada 5:\n1️⃣ Ihram\n2️⃣ Tawaf\n3️⃣ Saie\n4️⃣ Bercukur\n5️⃣ Tertib\n\n📖 [Baca](/panduan/umrah/tatacara-asas-umrah/)",
        solat: "Solat musafir: jarak >80km boleh qasar & jamak.\n\n🔧 [Kalkulator](/alat/solat-musafir/)",
        kos: "Kos umrah: RM5k–RM15k bergantung pakej.\n\n🔧 [Kalkulator](/alat/kalkulator-kos/)",
      };
      for (const [key, faq] of Object.entries(FAQ)) {
        if (lastMsg.includes(key)) {
          return new Response(JSON.stringify({ choices: [{ message: { content: faq } }] }), {
            status: 200, headers: { "Content-Type": "application/json" },
          });
        }
      }
      console.error(`LLM error ${llmResponse.status}: ${errText}`);
      return new Response(
        JSON.stringify({
          error: "LLM service unavailable",
          detail:
            llmResponse.status === 429
              ? "Terlalu banyak permintaan. Cuba lagi sebentar."
              : "Perkhidmatan AI tidak tersedia sekarang.",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Stream the LLM response directly to client
    return new Response(llmResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
