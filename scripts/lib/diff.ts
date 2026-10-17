import { isDeepStrictEqual } from "node:util";
import {
  COLLECTIONS,
  loadSchemas,
  type CollectionKey,
  type CollectionSchema,
} from "./collections.ts";
import { entryName, type Dataset, type Entry } from "./load.ts";

export type FieldChange =
  | { kind: "set" | "cleared"; label: string; value: string }
  | { kind: "changed"; label: string; from: string; to: string }
  | { kind: "text"; label: string }
  | { kind: "list"; label: string; added: string[]; removed: string[] };

export interface EntryChange {
  collection: CollectionKey;
  collectionLabel: string;
  id: string;
  name: string;
  kind: "added" | "removed" | "changed";
  fields: FieldChange[];
}

/** Longer than this, or multi-line, and a text change is summarised rather than shown. */
const SHORT_TEXT = 80;

/**
 * Compare two versions of the dataset and describe what changed in plain
 * English: entries added, removed or changed, and for changed entries which
 * fields changed. Linked entries are shown by name rather than ID.
 */
export function diffDatasets(
  base: Dataset,
  head: Dataset,
  schemas: Record<CollectionKey, CollectionSchema> = loadSchemas(),
): EntryChange[] {
  const names = (key: CollectionKey, id: string) => {
    const entry =
      head[key].find((e) => e.id === id) ?? base[key].find((e) => e.id === id);
    return entry ? entryName(entry) : id;
  };

  const changes: EntryChange[] = [];
  for (const { key, label } of COLLECTIONS) {
    const before = new Map(base[key].map((e) => [e.id, e]));
    const after = new Map(head[key].map((e) => [e.id, e]));
    const common = { collection: key, collectionLabel: label };

    for (const [id, entry] of after) {
      const old = before.get(id);
      if (!old) {
        changes.push({
          ...common,
          id,
          name: entryName(entry),
          kind: "added",
          fields: [],
        });
      } else if (!isDeepStrictEqual(old.data, entry.data)) {
        changes.push({
          ...common,
          id,
          name: entryName(entry),
          kind: "changed",
          fields: diffFields(old, entry, schemas[key], names),
        });
      }
    }
    for (const [id, entry] of before) {
      if (!after.has(id)) {
        changes.push({
          ...common,
          id,
          name: entryName(entry),
          kind: "removed",
          fields: [],
        });
      }
    }
  }
  return changes;
}

function diffFields(
  old: Entry,
  entry: Entry,
  schema: CollectionSchema,
  names: (key: CollectionKey, id: string) => string,
): FieldChange[] {
  const keys = new Set([...Object.keys(old.data), ...Object.keys(entry.data)]);
  const changes: FieldChange[] = [];

  for (const key of keys) {
    const from = old.data[key];
    const to = entry.data[key];
    if (isDeepStrictEqual(from, to)) continue;

    const prop = schema.properties[key] ?? {};
    const label = prop.title ?? key;
    const ref = prop["x-references"];

    if (Array.isArray(from) || Array.isArray(to)) {
      const show = (v: unknown) =>
        ref && typeof v === "string" ? names(ref, v) : display(v);
      const a = (Array.isArray(from) ? from : []).map(show);
      const b = (Array.isArray(to) ? to : []).map(show);
      changes.push({
        kind: "list",
        label,
        added: b.filter((v) => !a.includes(v)),
        removed: a.filter((v) => !b.includes(v)),
      });
    } else if (isLongText(from) || isLongText(to)) {
      changes.push({ kind: "text", label });
    } else if (from === undefined) {
      changes.push({ kind: "set", label, value: display(to) });
    } else if (to === undefined) {
      changes.push({ kind: "cleared", label, value: display(from) });
    } else {
      changes.push({
        kind: "changed",
        label,
        from: display(from),
        to: display(to),
      });
    }
  }
  return changes;
}

function isLongText(v: unknown): boolean {
  return typeof v === "string" && (v.length > SHORT_TEXT || v.includes("\n"));
}

function display(v: unknown): string {
  if (typeof v === "string") return isLongText(v) ? "(text)" : v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return String(o.title ?? o.name ?? JSON.stringify(v));
  }
  return String(v);
}

export function renderMarkdown(
  changes: EntryChange[],
  { title = "Changes" }: { title?: string } = {},
): string {
  const lines = [`## ${title}`, ""];
  if (changes.length === 0) {
    lines.push("No data changes.");
    return lines.join("\n") + "\n";
  }

  for (const { label } of COLLECTIONS) {
    const group = changes.filter((c) => c.collectionLabel === label);
    if (group.length === 0) continue;
    lines.push(`### ${label}`, "");
    for (const c of group) {
      lines.push(`- **${c.name}** ${c.kind} \`${c.id}\``);
      for (const f of c.fields) lines.push(`  - ${describeField(f)}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function describeField(f: FieldChange): string {
  switch (f.kind) {
    case "set":
      return `${f.label} set to "${f.value}"`;
    case "cleared":
      return `${f.label} removed (was "${f.value}")`;
    case "changed":
      return `${f.label} changed from "${f.from}" to "${f.to}"`;
    case "text":
      return `${f.label} text updated`;
    case "list": {
      const parts = [
        ...f.added.map((v) => `added "${v}"`),
        ...f.removed.map((v) => `removed "${v}"`),
      ];
      return `${f.label}: ${parts.join(", ") || "reordered"}`;
    }
  }
}
