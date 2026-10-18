import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginModule } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import campaignData, {
  type CampaignDataOptions,
} from "./plugins/campaign-data";

// Set by the deploy workflow: see .github/workflows/deploy.yml.
const env = process.env;

const config: Config = {
  title: "Vaccination campaign data",
  tagline: "The rules for each NHS vaccination campaign, in one place.",
  favicon: "img/favicon.svg",

  url: env.SITE_URL ?? "https://mikemonteith.github.io",
  baseUrl: env.BASE_URL ?? "/",
  trailingSlash: true,

  onBrokenLinks: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },

  i18n: { defaultLocale: "en-GB", locales: ["en-GB"] },

  presets: [
    [
      "classic",
      {
        docs: { sidebarPath: "./sidebars.ts", routeBasePath: "docs" },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      // Docusaurus types every plugin's options and content as unknown.
      campaignData as PluginModule,
      {
        bundlePath: "../dist/data/bundle.json",
        changesPath: env.CHANGES_JSON,
        versionsPath: env.VERSIONS_JSON,
      } satisfies CampaignDataOptions,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Campaign data",
      items: [
        { to: "/campaigns/", label: "Campaigns", position: "left" },
        { to: "/reference/", label: "Reference data", position: "left" },
        { to: "/changes/", label: "Changes", position: "left" },
        { to: "/data/", label: "Download", position: "left" },
        { to: "/docs/", label: "Guides", position: "left" },
        { href: "pathname:///admin/", label: "Edit data", position: "right" },
      ],
    },
    footer: {
      style: "light",
      copyright: `Data version ${env.DATA_VERSION ?? "unreleased"}`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
