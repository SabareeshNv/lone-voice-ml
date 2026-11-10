import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Essay = Post & { data: Post["data"] & { title: string } };

/** Entries per page of the thread. */
export const PAGE_SIZE = 30;

/** Entries per page of the "all essays" and "all scribbles" lists. */
export const LIST_PAGE_SIZE = 20;

/** A scribble longer than this many characters is shown collapsed in lists. */
export const COLLAPSE_AFTER = 600;
/** How much of a collapsed scribble stays visible. */
export const PREVIEW_LENGTH = 260;

export const isEssay = (post: Post): post is Essay => Boolean(post.data.title);

const load = () =>
  getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft).then((all) =>
    all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id)),
  );
let cache: Promise<Post[]> | undefined;

/** All published posts, newest first. Drafts show only in `astro dev`.
 *  In a build the list is read once and reused, since every page's side column needs it;
 *  in dev it is read fresh so edits show up. */
export function getPosts(): Promise<Post[]> {
  if (import.meta.env.DEV) return load();
  return (cache ??= load());
}

/* ---------- URLs ---------- */

export const pageHref = (n: number) => (n <= 1 ? "/" : `/${n}/`);

/** Stable URL of a post. Scribble URLs redirect to their place in the thread. */
export const postHref = (post: Post) =>
  isEssay(post) ? `/essays/${post.id}/` : `/scribbles/${post.id}/`;

/** Kind lists: "/essays/", "/essays/2/" … and the same for scribbles. */
export type Kind = "essays" | "scribbles";
export const kindHref = (kind: Kind, n = 1) => (n <= 1 ? `/${kind}/` : `/${kind}/${n}/`);

/** id of the entry element in the thread */
export const anchorId = (post: Post) => `post-${post.id}`;

/** Where a post currently sits in the thread, e.g. "/2/#post-rain" */
export function threadHref(all: Post[], post: Post) {
  const index = all.findIndex((p) => p.id === post.id);
  const page = Math.floor(Math.max(index, 0) / PAGE_SIZE) + 1;
  return `${pageHref(page)}#${anchorId(post)}`;
}

/* ---------- Dates ----------
   Front-matter dates like 2026-11-08 are read as midnight UTC,
   so they are always formatted in UTC to show the date as written. */

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options });

const longDate = fmt({ day: "numeric", month: "long", year: "numeric" });
const monthName = fmt({ month: "long" });
const shortDay = fmt({ day: "numeric", month: "short" });

export const formatDate = (d: Date) => longDate.format(d);
export const shortDate = (d: Date) => shortDay.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export interface MonthGroup {
  key: string; // "2026-11"
  month: string; // "November"
  year: number;
  posts: Post[];
}

export function groupByMonth(posts: Post[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const post of posts) {
    const d = post.data.date;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = { key, month: monthName.format(d), year: d.getUTCFullYear(), posts: [] };
      groups.push(group);
    }
    group.posts.push(post);
  }
  return groups;
}

export interface YearGroup {
  year: number;
  posts: Post[];
}

/** Posts (already newest first) grouped by year, for the archive. */
export function groupByYear(posts: Post[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    let group = groups.at(-1);
    if (!group || group.year !== year) {
      group = { year, posts: [] };
      groups.push(group);
    }
    group.posts.push(post);
  }
  return groups;
}

/* ---------- Text helpers ---------- */

/** Rough plain text from Markdown, for descriptions and search titles. */
export function plainText(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(markdown = "", max = 80) {
  const text = plainText(markdown);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** Reading time in minutes (Malayalam reads slower than English). */
export function readingMinutes(markdown = "") {
  const words = plainText(markdown).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 150));
}
