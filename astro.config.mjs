// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // Change this to your real address before deploying.
  site: "https://lonevoice-ml.pages.dev",

  // Every URL ends in "/" so in-page permalinks never trigger a redirect.
  trailingSlash: "always",

  // Component styles are scoped with :where(), which adds no specificity, so a
  // component's rules and the global ones in src/styles/ weigh the same as written.
  scopedStyleStrategy: "where",

  // Pages are fetched on hover/focus, so moving around feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },

  // Fonts are downloaded from Google Fonts at build time and served from this site.
  fonts: [
    // English: Alegreya Sans, upright only (no italic is used), three weights.
    {
      provider: fontProviders.google(),
      name: "Alegreya Sans",
      cssVariable: "--font-alegreya-sans",
      weights: [400, 700, 900],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Trebuchet MS", "sans-serif"],
    },
    // Malayalam: Manjari.
    {
      provider: fontProviders.google(),
      name: "Manjari",
      cssVariable: "--font-manjari",
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["malayalam"],
      fallbacks: ["sans-serif"],
    },
    // Malayalam post titles: Uroob (one weight), from the file in src/assets/fonts.
    {
      provider: fontProviders.local(),
      name: "Uroob",
      cssVariable: "--font-uroob",
      fallbacks: ["sans-serif"],
      options: {
        variants: [{ weight: 400, style: "normal", src: ["./src/assets/fonts/Uroob-Regular.woff2"] }],
      },
    },
  ],
});
