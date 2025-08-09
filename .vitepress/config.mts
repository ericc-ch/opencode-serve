import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Base path for GitHub Pages project site. Must match repository name with leading and trailing slashes.
  // If this repo is renamed or a custom domain (CNAME) is added, update to '/' accordingly.
  base: '/opencode-serve/',
  title: "opencode serve documentation",
  description: "AI generated documentation of opencode serve api",
  srcDir: "src",
  themeConfig: {
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Overview", link: "/index" },
          { text: "App API", link: "/app" },
          { text: "Events API", link: "/events" },
          { text: "Find API", link: "/find" },
          { text: "Schemas", link: "/schemas" },
          { text: "Sessions", link: "/sessions" },
          { text: "TUI", link: "/tui" },
          { text: "File Mode Log", link: "/file-mode-log" },
          { text: "Config", link: "/config" },
        ],
      },
    ],
    search: {
      provider: "local",
    },
  },
});
