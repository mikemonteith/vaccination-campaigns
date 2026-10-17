import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { marked } from "marked";

/**
 * Turns the built data bundle (dist/data/bundle.json) into pages: a campaign
 * list, a page per campaign, the reference data, a change summary and a
 * downloads page. Run `npm run build:data` first.
 */
export interface CampaignDataOptions {
  bundlePath: string;
  /** Output of `npm run diff -- --json`, if this build has a change summary. */
  changesPath?: string;
  /** JSON array of released versions, newest first, if known. */
  versionsPath?: string;
}

type Item = { id: string; name: string } & Record<string, unknown>;

interface Bundle {
  version: string;
  generatedAt: string;
  collections: Record<string, Item[]>;
}

export interface Content {
  bundle: Bundle;
  changes: unknown;
  versions: string[];
}

export interface GlobalData {
  version: string;
  generatedAt: string;
  counts: Record<string, number>;
  versions: string[];
}

function readJson<T>(file: string | undefined, siteDir: string): T | null {
  if (!file) return null;
  const full = path.resolve(siteDir, file);
  return existsSync(full) ? JSON.parse(readFileSync(full, "utf8")) : null;
}

export default function campaignData(
  context: LoadContext,
  options: CampaignDataOptions,
): Plugin<Content> {
  const { siteDir, baseUrl } = context;
  const route = (p: string) => `${baseUrl}${p}`.replace(/\/+/g, "/");
  const component = (name: string) => `@site/src/components/${name}`;

  return {
    name: "campaign-data",

    getPathsToWatch() {
      return [options.bundlePath, options.changesPath, options.versionsPath]
        .filter((p): p is string => !!p)
        .map((p) => path.resolve(siteDir, p));
    },

    async loadContent() {
      const bundle = readJson<Bundle>(options.bundlePath, siteDir);
      if (!bundle) {
        throw new Error(
          `No data bundle at ${options.bundlePath}. Run "npm run build:data" first.`,
        );
      }
      return {
        bundle,
        changes: readJson(options.changesPath, siteDir),
        versions: readJson<string[]>(options.versionsPath, siteDir) ?? [],
      };
    },

    async contentLoaded({ content, actions }) {
      const { createData, addRoute, setGlobalData } = actions;
      const { bundle, changes, versions } = content;
      const c = bundle.collections;
      const lookup = (key: string, ids: unknown) =>
        (Array.isArray(ids) ? ids : []).map(
          (id) => c[key]?.find((e) => e.id === id) ?? { id, name: id },
        );

      setGlobalData({
        version: bundle.version,
        generatedAt: bundle.generatedAt,
        counts: Object.fromEntries(
          Object.entries(c).map(([k, v]) => [k, v.length]),
        ),
        versions,
      } satisfies GlobalData);

      const campaigns = c.campaigns ?? [];
      addRoute({
        path: route("/campaigns/"),
        exact: true,
        component: component("CampaignList"),
        modules: {
          campaigns: await createData(
            "campaigns.json",
            JSON.stringify(campaigns),
          ),
        },
      });

      for (const campaign of campaigns) {
        const resolved = {
          campaign,
          summaryHtml:
            typeof campaign.summary === "string"
              ? await marked.parse(campaign.summary)
              : "",
          vaccines: lookup("vaccines", campaign.vaccines),
          cohorts: lookup("cohorts", campaign.cohorts),
          orgTypes: lookup("org-types", campaign.orgTypes),
        };
        addRoute({
          path: route(`/campaigns/${campaign.id}/`),
          exact: true,
          component: component("CampaignPage"),
          modules: {
            data: await createData(
              `campaign-${campaign.id}.json`,
              JSON.stringify(resolved),
            ),
          },
        });
      }

      addRoute({
        path: route("/reference/"),
        exact: true,
        component: component("ReferencePage"),
        modules: {
          reference: await createData(
            "reference.json",
            JSON.stringify({
              vaccines: c.vaccines ?? [],
              cohorts: c.cohorts ?? [],
              orgTypes: c["org-types"] ?? [],
            }),
          ),
        },
      });

      addRoute({
        path: route("/changes/"),
        exact: true,
        component: component("ChangesPage"),
        modules: {
          // Wrapped: a module whose value is null breaks the page loader.
          changes: await createData(
            "changes.json",
            JSON.stringify({ summary: changes }),
          ),
        },
      });

      addRoute({
        path: route("/data/"),
        exact: true,
        component: component("DownloadsPage"),
      });
    },
  };
}
