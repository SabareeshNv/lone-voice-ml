// RSS feed of the 30 newest posts. Essays link to their page; scribbles carry their
// full text and link to their place in the thread.
import type { APIRoute } from "astro";
import { SITE } from "../site";
import { excerpt, getPosts, isEssay, PAGE_SIZE, postHref } from "../lib/posts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPosts()).slice(0, PAGE_SIZE);
  const abs = (path: string) => new URL(path, site).href;

  const items = posts
    .map((post) => {
      const link = abs(postHref(post));
      const title = isEssay(post) ? post.data.title : excerpt(post.body, 70);
      const text = isEssay(post) ? (post.data.summary ?? excerpt(post.body, 300)) : post.body ?? "";
      return `    <item>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <category>${esc(post.data.mood)}</category>
      <description>${esc(text)}</description>
    </item>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${esc(abs("/"))}</link>
    <description>${esc(SITE.description)}</description>
    <language>${SITE.postLanguage}</language>
${items}
  </channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
