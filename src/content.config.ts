import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { moodKeys } from "./data/moods";

// One collection for everything. A post with a title is an Essay;
// a post without one is a Scribble.
const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(1).optional(),
        date: z.coerce.date(),
        mood: z.enum(moodKeys),
        summary: z
          .string()
          .trim()
          .min(1)
          .regex(/^[^\r\n]+$/, "The summary must be a single line.")
          .optional(),
        cover: z
          .object({
            src: image(),
            alt: z.string(), // describe the picture; use "" only if it is purely decorative
          })
          .optional(),
        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (!data.title && (data.summary || data.cover)) {
          ctx.addIssue({
            code: "custom",
            message:
              "`summary` and `cover` are for Essays only. Add a `title`, or remove them.",
          });
        }
      }),
});

export const collections = { posts };
