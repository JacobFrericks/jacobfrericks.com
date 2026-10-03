import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.jacobfrericks.com",
  // Never inline scripts or assets, so a strict Content Security Policy can allow 'self' only.
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
