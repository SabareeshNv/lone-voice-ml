# Lone Voice

A personal blog and microblog built with Astro 7 and plain modern CSS.
Posts are written in Malayalam; the interface is in English.

## Commands

| Command           | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `npm install`     | Install Astro, sharp and Pagefind (needs Node 22.12 or newer) |
| `npm run dev`     | Local preview at `http://localhost:4321` (search is off here) |
| `npm run build`   | Build the site into `dist/`, then build the search index    |
| `npm run new`     | Create a new post file with its front matter filled in      |
| `npm run preview` | Serve the finished `dist/` — use this to try search         |

Search only exists after `npm run build`, because Pagefind indexes the built HTML.

## Writing a post

The quickest way: run `npm run new`. It asks essay or scribble, then the mood (and, for an
essay, the Malayalam title and a short English file name), and creates the file in
`src/content/posts/` with today's date. Open it, write the text under the second `---`
line, and save. Shortcuts: `npm run new -- scribble` or `npm run new -- essay`; flags
`--mood`, `--title`, `--slug`, `--date YYYY-MM-DD` and `--draft` skip the questions. It
never overwrites an existing post. A scribble's file is named by its date
(`2026-11-10.md`, then `2026-11-10-2.md`). An essay's front matter includes the optional
summary and cover as commented-out lines to switch on.

To do it by hand instead:

Every post is one Markdown file in `src/content/posts/`. Use a short English
file name — it becomes the URL (`old-radio.md` → `/essays/old-radio/`).

**A Scribble** has no title:

```md
---
date: 2026-11-06
mood: why
---

എന്തിനാണ് ഓരോ ഫോമിലും ഒപ്പ് രണ്ടു തവണ ചോദിക്കുന്നത്?
```

**An Essay** has a title, and may have a one-line summary and a cover image:

```md
---
title: പഴയ റേഡിയോ
date: 2026-09-21
mood: wistful
summary: അപ്പൂപ്പന്റെ റേഡിയോയും, അതിനൊപ്പം നിശ്ശബ്ദമായ ഒരു കാലവും.
cover:
  src: ../../assets/covers/old-radio.jpg
  alt: A short description of the picture, for people who cannot see it
---

Text…
```

- Put cover images in `src/assets/covers/`. Astro resizes them and serves modern formats. A 3:2 picture (for example 1600 × 1067) fits the frame best.
- `draft: true` keeps a post visible in `npm run dev` but out of the built site.
- The build stops with a clear message if a mood is unknown, the summary has a line
  break, or a Scribble is given a summary or cover.

## Moods

Moods live in `src/data/moods.ts`: hopeful, idea, why, curious, wistful,
restless, grateful, quiet. To add one, add a line with a label and a hue (0–360).
The colour is derived from the hue and adjusted for light and dark themes.

Every mood label (in the side column, on each post and on essay pages) links to that
mood's own page, `/moods/<mood>/`, which lists all posts with that mood, newest first,
grouped by month, 30 to a page (`/moods/<mood>/2/` …). A mood gets a page as soon as one
post uses it. `/moods/` is an overview of all moods in use, each with its sticker and
post count; the side column links to it ("All moods"). Mood pages are not included in
search results.

## Long scribbles

A scribble is shown in full in lists as long as it is short. One longer than 600
characters shows its opening (about 260 characters) and a "Read the rest" button that
expands it in place; it needs no JavaScript and works with the keyboard. Change the
limits with `COLLAPSE_AFTER` and `PREVIEW_LENGTH` in `src/lib/posts.ts`. Essays are not
affected: the thread only ever shows an essay's title, summary and cover.

## Artwork and colours

- **Masthead**: the picture at the top of the home page is `src/assets/masthead.jpg`
  (about 3:1). Replace the file to change it; Astro resizes it for each screen. It is
  decorative and has no alt text.
- **Stickers**: one small drawn sticker per mood, in `src/data/art.ts` (original artwork,
  drawn as code), plus the tangled thread on the 404 page. To draw a sticker for a new
  mood, add an entry with the same name to `MOOD_ART` (64 × 64 box; use classes `f` for a white
  fill, `k` for a line, `kf` for a dark fill). A mood without a drawing gets a plain smiling face.
- **Colours**: a neutral base (white in light, near-black in dark), a sunset-orange accent and
  four bright artwork tones (coral, sky blue, orange, gold), set once as tokens at the top of `src/styles/base.css` (`--bg`, `--ink`, `--accent`, and the
  four artwork colours `--c1` … `--c4`). Mood colours come from each mood's hue in
  `src/data/moods.ts`. Change the tokens to retheme the whole site.

## How the pieces fit

- **Home** (`src/pages/[...page].astro`): all posts, newest first, grouped by
  month, 30 per page (`/`, `/2/`, `/3/` …). Change `PAGE_SIZE` in `src/lib/posts.ts`.
- **Essays** get their own page at `/essays/<file-name>/`.
- **Scribbles** show in full in the thread. Each has a stable permalink,
  `/scribbles/<file-name>/`, which sends the reader to the scribble's current place in
  the thread and scrolls to it. Because scribbles move to later pages as you write
  more, the permalink is rebuilt to point at the right page every time you build.
- **Search** (Pagefind): only essay and scribble pages are indexed (`data-pagefind-body`).
  Press the search button in the side column; the search box opens in a dialog.
- **Fonts**: Alegreya Sans (English), Manjari (Malayalam text) and Uroob (Malayalam post titles; the file is in `src/assets/fonts/`) — the first two are downloaded from Google Fonts
  at build time by Astro's Fonts API and served from your own site. Anything marked
  `lang="ml"` uses Manjari, except post titles, which use Uroob.
- **Theme**: Light, Dark or System. The choice is saved in the browser. Colours are set
  once with CSS `light-dark()` in `src/styles/tokens.css`.

## Site details to change

- `src/site.ts` — site name, tagline, description, and `author` (optional; used only in
  search-engine data, left out while empty)
- `astro.config.mjs` — `site` (your real web address). Canonical links, the sitemap, the
  RSS feed and social-sharing images all depend on it, so set it before deploying.
- `public/og-default.png` — the picture shown when a page without its own picture is shared
  (1200 × 630). Replace it with your own.

## Search engines and feeds

- Every page has a title, description, canonical link, Open Graph and Twitter tags, and a
  theme colour. Essays also carry `BlogPosting` data and use their cover (cropped to
  1200 × 630) as the sharing picture.
- `/sitemap.xml`, `/robots.txt` and `/rss.xml` (the 30 newest posts) are generated at build time.
- Scribble permalinks redirect into the thread, so they are marked `noindex` and left out of
  the sitemap; the thread pages carry their text. The 404 page is also `noindex`.
- Pagefind search is unaffected.

## Essays and Scribbles lists

`/essays/` and `/scribbles/` list every post of that kind, newest first, grouped by month
like the thread, 20 to a page (`/essays/2/` …). Change `LIST_PAGE_SIZE` in
`src/lib/posts.ts`. Because later pages use numbers, do not give a post the file name `2`
(or any number) — it would clash with the page address.

## Archive and link previews

- `/archive/` lists every post, year by year, as a plain list (date, title or the opening
  of a scribble, mood) with year links at the top. Scribbles link to their place in the thread.
  It is in the side column on wide screens and in the Moods menu on phones.
- A scribble link previews the scribble's own text (its first lines), not just
  "Scribble, <date>". Essays preview their title and summary, and their cover if they have one.

## The side column

Top to bottom: name and tagline, search, where to go (the thread, essays, scribbles, archive, moods,
each with a count; the current place is highlighted), and the theme button
(a sticker that cycles Light, Dark, System: sun, moon, half-circle) and the footer links at the foot. On phones it is a slim bar: name, search and theme sticker on
one row, the same places in a second row, and a "Moods" button that opens the mood labels as a
small menu (closes with Escape or a tap elsewhere). Markup and styles: `src/components/Rail.astro`.

## Footer and policy pages

On wide screens the footer sits at the foot of the side column (which stays in view while
you scroll a long thread); on phones it is at the bottom of the page. It links to `/copyright/`, `/privacy/` and `/content-policy/`
(`src/pages/`, sharing `src/layouts/Legal.astro`). They are starting texts that describe how
this site is built (no cookies, analytics or comments; the theme choice is kept in the
browser). Read them and change anything that is not true for you. In particular, the
**AI disclosure in the Content Policy** says the posts are written by you and that Claude
helped build the site and its artwork; edit it to match what you actually do. Set `author`,
`contact` and `policiesUpdated` in `src/site.ts`; the footer, the pages and the sitemap use them.

## Page headings

Each page has exactly one `h1`. On the home page it is the site name (top of the side
column); the thread opens with the masthead picture instead of a big heading. On the
thread's later pages a hidden `h1` ("Home, page 2") is added for screen readers and search engines.

## Small screens

Below 60rem the side column becomes a slim top bar: name, search icon and theme sticker on
one row; a second row shows the counts and a "Moods" button that unfolds the mood labels
(with the "All moods" and "Archive" links). The tagline stays in the side column on wide screens (`src/components/Rail.astro`, last section of its styles).

## Styles

Each component and page keeps its own CSS in a `<style>` block at the bottom of its `.astro`
file. Astro scopes those rules to that file, and only ships them on pages that use it.
`src/styles/` holds only what is truly global or shared by several files:

- `tokens.css`: colours, fonts, sizes. Change these to retheme the site.
- `base.css`: resets, plain HTML elements, Malayalam text, links, focus, site-wide motion,
  and small utilities (`.vh` visually hidden, `.sep`, `.meta` for a line of details,
  `.ml-title` for Uroob titles). These two are loaded on every page by `Base.astro`.
- `page-head.css`: the big page titles and the line under them (imported by the pages that have one).
- `prose.css`: post bodies written in Markdown (imported by the files that show them).
- `entry.css`: what essays and scribbles in the thread share (imported by `EssayEntry` and `ScribbleEntry`).

Scoping uses `:where()` (`scopedStyleStrategy: "where"` in `astro.config.mjs`), so it adds no
specificity. To style something drawn by another component or by Markdown (a mood sticker,
the cover image, the drawing set with `set:html`), the rule wraps that part in `:global(…)`
under one of the file's own classes, for example `.essay__head :global(.essay__badge)`.

## Keeping it light

- Fonts: Alegreya Sans in three weights (400, 700, 900), Manjari in two (400, 700), Uroob in one (titles are scaled up with `--uroob-scale` in `tokens.css`),
  upright only, only the subsets used. Add a weight in `astro.config.mjs` before using it in CSS.
- The post list is read once per build and shared by all pages.

## Deploying (Cloudflare Pages or similar)

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22.12 or newer
