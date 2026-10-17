import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

/**
 * The collections that make up the dataset. Adding a collection means adding
 * an entry here, a schema in `schema/`, a folder in `data/` and a matching
 * collection in the CMS config (`npm run check:cms` enforces the last part).
 */
export const COLLECTIONS = [
  { key: "campaigns", label: "Campaigns", schemaFile: "campaign.schema.json" },
  { key: "vaccines", label: "Vaccines", schemaFile: "vaccine.schema.json" },
  { key: "cohorts", label: "Cohorts", schemaFile: "cohort.schema.json" },
  {
    key: "org-types",
    label: "Organisation types",
    schemaFile: "org-type.schema.json",
  },
] as const;

export type CollectionKey = (typeof COLLECTIONS)[number]["key"];

export interface PropertySchema {
  title?: string;
  description?: string;
  type?: string;
  enum?: unknown[];
  format?: string;
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  required?: string[];
  /** Custom annotation: this property holds IDs of entries in another collection. */
  "x-references"?: CollectionKey;
  [key: string]: unknown;
}

export interface CollectionSchema extends PropertySchema {
  $id: string;
  title: string;
  properties: Record<string, PropertySchema>;
  required: string[];
}

export function loadSchema(
  schemaFile: string,
  schemaDir = path.join(REPO_ROOT, "schema"),
): CollectionSchema {
  return JSON.parse(readFileSync(path.join(schemaDir, schemaFile), "utf8"));
}

export function loadSchemas(
  schemaDir?: string,
): Record<CollectionKey, CollectionSchema> {
  return Object.fromEntries(
    COLLECTIONS.map((c) => [c.key, loadSchema(c.schemaFile, schemaDir)]),
  ) as Record<CollectionKey, CollectionSchema>;
}

/** Properties of a schema that reference another collection. */
export function referenceProperties(
  schema: CollectionSchema,
): { property: string; collection: CollectionKey }[] {
  return Object.entries(schema.properties).flatMap(([property, prop]) =>
    prop["x-references"]
      ? [{ property, collection: prop["x-references"] }]
      : [],
  );
}
