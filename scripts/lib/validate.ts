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
}

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validateDataset(
  dataset: Dataset,
  schemas: Record<CollectionKey, CollectionSchema> = loadSchemas(),
): Issue[] {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addKeyword({ keyword: "x-references", schemaType: "string" });

  const issues: Issue[] = [];

  for (const { key } of COLLECTIONS) {
    const schema = schemas[key];
    const check = ajv.compile(schema);

    for (const entry of dataset[key]) {
      if (!ID_PATTERN.test(entry.id)) {
        issues.push({
          file: entry.file,
          message: `file name "${entry.id}" must be lower-case words separated by hyphens`,
        });
      }

      if (!check(entry.data)) {
        for (const err of check.errors ?? []) {
          const where = err.instancePath || "(entry)";
          issues.push({
            file: entry.file,
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
        message: `/endDate (${endDate}) is before /startDate (${startDate})`,
      });
    }
  }

  return issues;
}
