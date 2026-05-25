import { getCollection } from "astro:content";

/** Build-time JSON endpoint — returns all searchable content for client-side search. */
export async function GET() {
  const guides = await getCollection("guide", ({ data }) => !data.draft);
  const articles = await getCollection("article", ({ data }) => !data.draft);

  const index = [
    ...guides.map((g) => ({
      type: "guide" as const,
      title: g.data.title,
      description: g.data.description,
      section: g.data.section,
      url: `/panduan/${g.data.section}/${g.id}/`,
    })),
    ...articles.map((a) => ({
      type: "article" as const,
      title: a.data.title,
      description: a.data.description,
      category: a.data.category,
      tags: a.data.tags,
      url: `/artikel/${a.data.category}/${a.id}/`,
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
  });
}
