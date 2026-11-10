// Sitemap of the pages worth indexing. Scribble permalinks (they redirect into the
// thread) and the 404 page are left out on purpose.
import type { APIRoute } from "astro";
import { moodHref, moodKeys } from "../data/moods";
import { getPosts, isEssay, isoDate, kindHref, LIST_PAGE_SIZE, PAGE_SIZE, pageHref, postHref } from "../lib/posts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const abs = (path: string) => new URL(path, site).href;
  const pages = (count: number) => Math.max(1, Math.ceil(count / PAGE_SIZE));
  const urls: { loc: string; lastmod?: string }[] = [];

  const newest = posts[0] && isoDate(posts[0].data.date);
  for (let n = 1; n <= pages(posts.length); n++) urls.push({ loc: abs(pageHref(n)), lastmod: newest });

  for (const [kind, list] of [
    ["essays", posts.filter(isEssay)],
    ["scribbles", posts.filter((p) => !isEssay(p))],
  ] as const) {
    const count = Math.max(1, Math.ceil(list.length / LIST_PAGE_SIZE));
    for (let n = 1; n <= count; n++) {
      urls.push({ loc: abs(kindHref(kind, n)), lastmod: list[0] && isoDate(list[0].data.date) });
    }
  }

  for (const post of posts.filter(isEssay)) {
    urls.push({ loc: abs(postHref(post)), lastmod: isoDate(post.data.date) });
  }

  urls.push({ loc: abs("/moods/") });
  urls.push({ loc: abs("/archive/"), lastmod: newest });
  for (const path of ["/copyright/", "/privacy/", "/content-policy/"]) urls.push({ loc: abs(path) });
  for (const key of moodKeys) {
    const inMood = posts.filter((p) => p.data.mood === key);
    if (inMood.length === 0) continue;
    for (let n = 1; n <= pages(inMood.length); n++) {
      urls.push({
        loc: abs(n === 1 ? moodHref(key) : `${moodHref(key)}${n}/`),
        lastmod: isoDate(inMood[0].data.date),
      });
    }
  }

  const body = urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
