import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  COLLECTIONS,
  loadSchemas,
  referenceProperties,
  type CollectionKey,
  type CollectionSchema,
} from "./collections.ts";
import type { Dataset } from "./load.ts";

export interface Issue {
  file: string;
  message: string;
  /** Errors fail the build. Warnings are reported but don't. */
  level: "error" | "warning";
}

export interface ValidateOptions {
  /**
   * Lenient mode is for draft changes that are still in the CMS's editorial
   * workflow: missing required fields and links to entries that don't exist
   * yet (perhaps because they're in another draft) are warnings, not errors.
   * Everything is strict when a release is prepared.
   */
  lenient?: boolean;
  schemas?: Record<CollectionKey, CollectionSchema>;
}

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validateDataset(
  dataset: Dataset,
  { lenient = false, schemas = loadSchemas() }: ValidateOptions = {},
): Issue[] {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addKeyword({ keyword: "x-references", schemaType: "string" });

  const softLevel = lenient ? "warning" : "error";
  const issues: Issue[] = [];

  for (const { key } of COLLECTIONS) {
    const schema = schemas[key];
    const check = ajv.compile(schema);

    for (const entry of dataset[key]) {
      if (!ID_PATTERN.test(entry.id)) {
        issues.push({
          file: entry.file,
          level: "error",
          message: `file name "${entry.id}" must be lower-case words separated by hyphens`,
        });
      }

      if (!check(entry.data)) {
        for (const err of check.errors ?? []) {
          const where = err.instancePath || "(entry)";
          issues.push({
            file: entry.file,
            level: err.keyword === "required" ? softLevel : "error",
            message: `${where} ${err.message}`,
          });
        }
      }

      for (const ref of referenceProperties(schema)) {
        const value = entry.data[ref.property];
        const ids = Array.isArray(value) ? value : value ? [value] : [];
        const known = new Set(dataset[ref.collection].map((e) => e.id));
        for (const id of ids) {
          if (typeof id === "string" && !known.has(id)) {
            issues.push({
              file: entry.file,
              level: softLevel,
              message: `/${ref.property} refers to "${id}", which is not in ${ref.collection}`,
            });
          }
        }
      }
    }
  }

  for (const entry of dataset.campaigns) {
    const { startDate, endDate } = entry.data;
    if (
      typeof startDate === "string" &&
      typeof endDate === "string" &&
      endDate < startDate
    ) {
      issues.push({
        file: entry.file,
        level: "error",
        message: `/endDate (${endDate}) is before /startDate (${startDate})`,
      });
    }
  }

  return issues;
}
