import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginModule } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import campaignData, {
  type CampaignDataOptions,
} from "./plugins/campaign-data";

// The deploy workflow builds this site twice: the released site (main) at the
// root, and a preview of staging under /staging/. These variables say which.
const env = process.env;
const isStaging = env.SITE_ENV === "staging";

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
    announcementBar: isStaging
      ? {
          id: "staging",
          content:
            "This is a <b>preview of unreleased changes</b>. Don't build against it: use the released data instead.",
          backgroundColor: "#ffeb3b",
          textColor: "#212b32",
          isCloseable: false,
        }
      : undefined,
    navbar: {
      title: isStaging ? "Campaign data (preview)" : "Campaign data",
      items: [
        { to: "/campaigns/", label: "Campaigns", position: "left" },
        { to: "/reference/", label: "Reference data", position: "left" },
        { to: "/changes/", label: "Changes", position: "left" },
        { to: "/data/", label: "Download", position: "left" },
        { to: "/docs/", label: "Guides", position: "left" },
        ...(isStaging
          ? []
          : [
              {
                href: "pathname:///admin/",
                label: "Edit data",
                position: "right" as const,
              },
            ]),
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
