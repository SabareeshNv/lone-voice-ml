// Original artwork, drawn as SVG so it follows the light/dark theme.
// Colours come from the CSS in MoodGlyph.astro (and 404.astro for LOST):
// .f = white fill, .k = dark outline, .kf = dark fill.
// Every glyph is drawn in a 64 × 64 box.

export const MOOD_ART: Record<string, string> = {
  // a sun coming up over the horizon
  hopeful: `
    <path class="f k" d="M18 42a14 14 0 0 1 28 0Z"/>
    <path class="k" d="M8 42h48M18 50h28"/>
    <path class="k" d="M32 12v7M16 20l5 5M48 20l-5 5M8 32h6M50 32h6"/>`,

  // a bulb with a spark
  idea: `
    <path class="f k" d="M32 12a15 15 0 0 0-8 27.6V44h16v-4.6A15 15 0 0 0 32 12Z"/>
    <path class="k" d="M25 51h14M28 56h8"/>
    <path class="k" d="M27 26l5 6 5-6M32 32v12"/>
    <path class="k" d="M7 20l6 2M57 20l-6 2M32 2v4"/>`,

  // a speech bubble, a question
  why: `
    <path class="f k" d="M10 11h44a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4H31l-10 10V44H10a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4Z"/>
    <path class="k" d="M25 24a7 7 0 1 1 9.5 6.6c-2 .9-2.5 2.2-2.5 4.4"/>
    <circle class="kf" cx="32" cy="40" r="2"/>`,

  // a magnifying glass
  curious: `
    <circle class="f k" cx="27" cy="27" r="16"/>
    <path class="k" d="M39 39l16 16" style="stroke-width:7"/>
    <path class="k" d="M18 23a10 10 0 0 1 8-8"/>`,

  // a crescent moon and two sparkles
  wistful: `
    <path class="f k" d="M38 8a22 22 0 1 0 18 34A18 18 0 0 1 38 8Z"/>
    <path class="k" d="M48 12v8M44 16h8M54 28v5M51.5 30.5h5"/>`,

  // wind, curling
  restless: `
    <circle class="f" cx="30" cy="32" r="22"/>
    <path class="k" d="M6 24h32a7 7 0 1 0-7-7"/>
    <path class="k" d="M6 35h44a7 7 0 1 1-7 7"/>
    <path class="k" d="M6 46h22"/>`,

  // a heart
  grateful: `
    <path class="f k" d="M32 55C13 41 7 30 7 22a12.5 12.5 0 0 1 25-3 12.5 12.5 0 0 1 25 3c0 8-6 19-25 33Z"/>
    <path class="k" d="M15 22a7 7 0 0 1 6-7"/>`,

  // a cup of tea, steam rising
  quiet: `
    <path class="f k" d="M12 31h32v9a14 14 0 0 1-14 14h-4a14 14 0 0 1-14-14Z"/>
    <path class="k" d="M44 35h3a6 6 0 0 1 0 12h-5"/>
    <path class="k" d="M21 25c-3-3 3-5 0-10M32 25c-3-3 3-5 0-10"/>
    <path class="k" d="M9 59h38"/>`,
};

/** Fallback for a mood with no drawing of its own. */
export const MOOD_ART_DEFAULT = `
  <circle class="f k" cx="32" cy="32" r="18"/>
  <path class="k" d="M24 36q8 8 16 0"/>
  <circle class="kf" cx="26" cy="27" r="2"/><circle class="kf" cx="38" cy="27" r="2"/>`;

/** A tangle of thread, for the 404 page. Drawn in a 400 × 260 box. */
export const LOST = `
  <path class="mh-thread lost-line" d="M10 200C70 40 130 250 190 120S300 30 270 150 150 240 220 200 360 90 390 190"/>
  <circle class="mh-knot" style="--k:var(--c3)" cx="10" cy="200" r="10"/>
  <circle class="mh-knot" style="--k:var(--c4)" cx="390" cy="190" r="10"/>
  <circle class="mh-knot" style="--k:var(--c2)" cx="190" cy="120" r="8"/>
  <path class="k" d="M176 52a14 14 0 1 1 18 13c-3 1-4 4-4 8" style="stroke-width:5"/>
  <circle class="kf" cx="190" cy="86" r="3.5"/>`;
