// Creates a new post file in src/content/posts/ with the front matter filled in.
//
//   npm run new                      asks a few questions
//   npm run new -- essay             an essay (asks for the title, file name and mood)
//   npm run new -- scribble          a scribble (asks only for the mood)
//
// Optional flags skip the questions:
//   --mood curious   --title "പഴയ റേഡിയോ"   --slug old-radio   --date 2026-11-10   --draft
//
// It only creates the file; it never overwrites one, and it does not need the dev server.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const postsDir = new URL("src/content/posts/", root);

// ---- moods: read from src/data/moods.ts so there is one list only
const moodsSource = readFileSync(new URL("src/data/moods.ts", root), "utf8");
const moods = [...moodsSource.matchAll(/^\s*"?([a-z][\w-]*)"?:\s*\{\s*label:/gm)].map((m) => m[1]);
if (moods.length === 0) fail("Could not read the moods from src/data/moods.ts.");

// ---- arguments
const args = process.argv.slice(2);
const flags = {};
const words = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].slice(2);
    const next = args[i + 1];
    if (key === "draft" || next === undefined || next.startsWith("--")) flags[key] = true;
    else flags[key] = args[++i];
  } else words.push(args[i]);
}

// Lines are read through one iterator, so typed and piped input both work.
const rl = createInterface({ input: process.stdin });
const input = rl[Symbol.asyncIterator]();
async function ask(question, fallback = "") {
  process.stdout.write(question);
  const { value } = await input.next();
  if (!process.stdin.isTTY) process.stdout.write("\n");
  return (value ?? "").trim() || fallback;
}
function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

// ---- kind
let kind = words[0];
if (kind && !["essay", "scribble"].includes(kind)) fail(`Say "essay" or "scribble", not "${kind}".`);
if (!kind) {
  const a = await ask("Essay (with a title) or scribble (without)? [e/s] ", "s");
  kind = a.toLowerCase().startsWith("e") ? "essay" : "scribble";
}

// ---- mood
let mood = flags.mood;
if (!mood) {
  console.log("\nMood:");
  moods.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
  const a = await ask("Pick a number or name [1] ", "1");
  mood = /^\d+$/.test(a) ? moods[Number(a) - 1] : a;
}
if (!moods.includes(mood)) fail(`"${mood}" is not a mood. Choose one of: ${moods.join(", ")}.`);

// ---- date (today, on this computer)
const now = new Date();
const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
const date = flags.date && flags.date !== true ? flags.date : today;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fail(`"${date}" is not a date. Use YYYY-MM-DD.`);

// ---- title and file name
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

let title = "";
let slug = flags.slug && flags.slug !== true ? slugify(flags.slug) : "";
if (kind === "essay") {
  title = flags.title && flags.title !== true ? flags.title : await ask("\nTitle (Malayalam): ");
  if (!title) fail("An essay needs a title.");
  if (/["\n]/.test(title)) fail('Please leave quotes and line breaks out of the title.');
  if (!slug) slug = slugify(await ask("File name in English, e.g. old-radio: "));
  if (!slug) fail("An essay needs a short English file name, because it becomes the web address.");
  if (/^\d+$/.test(slug)) fail("The file name cannot be only digits (it would clash with page numbers).");
} else if (!slug) {
  // Scribbles are named by date: 2026-11-10, then 2026-11-10-2, -3 …
  slug = date;
  for (let n = 2; existsSync(new URL(`${slug}.md`, postsDir)); n++) slug = `${date}-${n}`;
}

const file = new URL(`${slug}.md`, postsDir);
if (existsSync(file)) fail(`src/content/posts/${slug}.md already exists. Nothing was changed.`);

// ---- write
const lines = ["---"];
if (kind === "essay") lines.push(`title: ${title}`);
lines.push(`date: ${date}`, `mood: ${mood}`);
if (kind === "essay") {
  lines.push(
    "# Optional: a one-line summary (shown in the thread) and a cover picture.",
    "# Delete the # at the start of the lines to use them.",
    "# summary: ",
    "# cover:",
    `#   src: ../../assets/covers/${slug}.jpg`,
    "#   alt: Describe the picture, for people who cannot see it",
  );
}
if (flags.draft) lines.push("draft: true");
lines.push("---", "", "");

writeFileSync(file, lines.join("\n"));
rl.close();

const shown = fileURLToPath(file).replace(fileURLToPath(root), "");
console.log(`\nCreated ${shown}`);
console.log(kind === "essay" ? `It will appear at /essays/${slug}/` : `It will appear at /scribbles/${slug}/`);
console.log("Write the text under the second --- line, save, and it is part of the next build.");
