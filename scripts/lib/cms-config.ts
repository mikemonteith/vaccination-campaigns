import { readFileSync } from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import {
  COLLECTIONS,
  REPO_ROOT,
  loadSchemas,
  type CollectionKey,
  type CollectionSchema,
  type PropertySchema,
} from "./collections.ts";

export const CMS_DIR = path.join(REPO_ROOT, "site/static/admin");

interface CmsField {
  name: string;
  widget?: string;
  required?: boolean;
  multiple?: boolean;
  collection?: string;
  options?: (string | { value: unknown })[];
  fields?: CmsField[];
  field?: CmsField;
}

interface CmsCollection {
  name: string;
  folder?: string;
  extension?: string;
  format?: string;
  fields: CmsField[];
}

/** Which CMS widgets can store each JSON Schema type. */
const WIDGETS_FOR_TYPE: Record<string, string[]> = {
  string: ["string", "text", "markdown", "select", "datetime", "relation"],
  integer: ["number"],
  number: ["number"],
  boolean: ["boolean"],
  array: ["list", "relation", "select"],
  object: ["object"],
};

/**
 * Check the Sveltia CMS config against Sveltia's own config schema, and check
 * that every collection's fields match its JSON Schema: same field names,
 * same required fields, matching select options and links. The JSON Schemas
 * are the contract; this stops the editing forms drifting away from it.
 */
export function checkCmsConfig(
  configText = readFileSync(path.join(CMS_DIR, "config.yml"), "utf8"),
  schemas: Record<CollectionKey, CollectionSchema> = loadSchemas(),
): string[] {
  const config = parse(configText);
  const problems: string[] = [];

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateConfig = ajv.compile(sveltiaConfigSchema());
  if (!validateConfig(config)) {
    // anyOf branches repeat the same error, so report each one once.
    const messages = new Set(
      (validateConfig.errors ?? []).map((err) => {
        const extra =
          "additionalProperty" in err.params
            ? `: "${err.params.additionalProperty}"`
            : "";
        return `config.yml${err.instancePath} ${err.message}${extra} (Sveltia config schema)`;
      }),
    );
    problems.push(...messages);
  }

  const collections: CmsCollection[] = config?.collections ?? [];
  for (const { key } of COLLECTIONS) {
    const cms = collections.find((c) => c.name === key);
    if (!cms) {
      problems.push(`CMS has no collection named "${key}"`);
      continue;
    }
    if (cms.folder !== `data/${key}`) {
      problems.push(`${key}: folder should be "data/${key}"`);
    }
    if (cms.extension !== "yaml" || cms.format !== "yaml") {
      problems.push(`${key}: extension and format should both be "yaml"`);
    }
    compareFields(key, cms.fields, schemas[key], problems);
  }
  for (const c of collections) {
    if (!COLLECTIONS.some(({ key }) => key === c.name)) {
      problems.push(`CMS collection "${c.name}" has no schema`);
    }
  }

  problems.push(...checkCmsPage(config?.backend?.repo));
  return problems;
}

function compareFields(
  where: string,
  fields: CmsField[],
  schema: PropertySchema,
  problems: string[],
) {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);

  for (const name of Object.keys(props)) {
    if (!fields.some((f) => f.name === name)) {
      problems.push(`${where}: schema property "${name}" has no CMS field`);
    }
  }

  for (const field of fields) {
    const at = `${where}.${field.name}`;
    const prop = props[field.name];
    if (!prop) {
      problems.push(`${at}: CMS field is not in the schema`);
      continue;
    }

    // CMS fields are required unless they say otherwise.
    const cmsRequired = field.required !== false;
    if (cmsRequired !== required.has(field.name)) {
      problems.push(
        `${at}: ${required.has(field.name) ? "required" : "optional"} in the schema but ${cmsRequired ? "required" : "optional"} in the CMS`,
      );
    }

    const widget = field.widget ?? "string";
    if (prop.type && !WIDGETS_FOR_TYPE[prop.type]?.includes(widget)) {
      problems.push(
        `${at}: widget "${widget}" can't store a schema "${prop.type}"`,
      );
    }
    const isList = prop.type === "array";
    if ((widget === "relation" || widget === "select") && isList) {
      if (field.multiple !== true) {
        problems.push(`${at}: should set "multiple: true" for a list`);
      }
    }

    const ref = prop["x-references"];
    if (ref || widget === "relation") {
      if (widget !== "relation" || field.collection !== ref) {
        problems.push(
          `${at}: should be a relation to the "${ref}" collection (schema x-references)`,
        );
      }
    }

    const enumValues = isList ? prop.items?.enum : prop.enum;
    if (enumValues || widget === "select") {
      const options = (field.options ?? []).map((o) =>
        typeof o === "object" ? o.value : o,
      );
      if (
        widget !== "select" ||
        JSON.stringify([...options].sort()) !==
          JSON.stringify([...(enumValues ?? [])].sort())
      ) {
        problems.push(`${at}: select options should match the schema enum`);
      }
    }

    if (widget === "list" && prop.items?.type === "object") {
      compareFields(at, field.fields ?? [], prop.items, problems);
    }
  }
}

// The package doesn't export these files, so read them from node_modules.
const SVELTIA_DIR = path.join(REPO_ROOT, "node_modules/@sveltia/cms");

function sveltiaConfigSchema(): object {
  return JSON.parse(
    readFileSync(path.join(SVELTIA_DIR, "schema/sveltia-cms.json"), "utf8"),
  );
}

/**
 * The CMS page should load the same Sveltia version the config is checked
 * against, and look up editors' branches in the repository the config uses.
 */
function checkCmsPage(repo: string | undefined): string[] {
  const { version } = JSON.parse(
    readFileSync(path.join(SVELTIA_DIR, "package.json"), "utf8"),
  );
  const html = readFileSync(path.join(CMS_DIR, "index.html"), "utf8");
  const problems: string[] = [];
  if (!html.includes(`@sveltia/cms@${version}/`)) {
    problems.push(
      `admin/index.html should load @sveltia/cms@${version}, the version in package.json`,
    );
  }
  if (!html.includes(`const REPO = "${repo}";`)) {
    problems.push(
      `admin/index.html should set REPO to "${repo}", the backend.repo in config.yml`,
    );
  }
  return problems;
}
