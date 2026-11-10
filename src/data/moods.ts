// Every post has one mood. To add a mood, add a key here — the content
// schema, colours and the mood index in the sidebar pick it up automatically.
// `hue` is an OKLCH hue angle (0–360) used to tint the mood label.
export const MOODS = {
  hopeful: { label: "hopeful", hue: 145 },
  idea: { label: "idea", hue: 95 },
  why: { label: "why?", hue: 40 },
  curious: { label: "curious", hue: 195 },
  wistful: { label: "wistful", hue: 20 },
  restless: { label: "restless", hue: 70 },
  grateful: { label: "grateful", hue: 120 },
  quiet: { label: "quiet", hue: 220 },
} as const;

export type MoodKey = keyof typeof MOODS;

/** Address of a mood's own page, which lists every post with that mood. */
export const moodHref = (key: MoodKey) => `/moods/${key}/`;

export const moodKeys = Object.keys(MOODS) as [MoodKey, ...MoodKey[]];
