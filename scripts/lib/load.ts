import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { COLLECTIONS, REPO_ROOT, type CollectionKey } from "./collections.ts";

export interface Entry {
  /** The entry's ID, taken from its file name. */
  id: string;
  /** Path relative to the data directory, for error messages. */
  file: string;
  data: Record<string, unknown>;
}

export type Dataset = Record<CollectionKey, Entry[]>;

export const DEFAULT_DATA_DIR = path.join(REPO_ROOT, "data");

export function loadDataset(dataDir = DEFAULT_DATA_DIR): Dataset {
  return Object.fromEntries(
    COLLECTIONS.map(({ key }) => [key, loadCollection(dataDir, key)]),
  ) as Dataset;
}

function loadCollection(dataDir: string, key: CollectionKey): Entry[] {
  const dir = path.join(dataDir, key);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort()
    .map((name) => {
      const file = path.join(key, name);
      const data = parse(readFileSync(path.join(dir, name), "utf8")) ?? {};
      return { id: name.replace(/\.ya?ml$/, ""), file, data };
    });
}

/** The human-readable name of an entry, falling back to its ID. */
export function entryName(entry: Entry): string {
  return typeof entry.data.name === "string" && entry.data.name
    ? entry.data.name
    : entry.id;
}
