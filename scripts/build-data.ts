// Build the machine-readable outputs into dist/data:
//
//   bundle.json            every collection in one file
//   <collection>.json      one file per collection
//   schema/*.schema.json   the schemas, for consumers to validate against
//
//   npm run build:data -- --version v2026.1
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { buildBundle } from "./lib/bundle.ts";
import { COLLECTIONS, REPO_ROOT } from "./lib/collections.ts";
import { loadDataset } from "./lib/load.ts";

const { values } = parseArgs({
  options: {
    version: { type: "string", default: "unreleased" },
    data: { type: "string" },
    out: { type: "string", default: path.join(REPO_ROOT, "dist/data") },
  },
});

const out = path.resolve(values.out);
rmSync(out, { recursive: true, force: true });
mkdirSync(path.join(out, "schema"), { recursive: true });

const bundle = buildBundle(loadDataset(values.data), values.version);
const write = (file: string, data: unknown) =>
  writeFileSync(path.join(out, file), JSON.stringify(data, null, 2) + "\n");

write("bundle.json", bundle);
for (const { key } of COLLECTIONS) {
  write(`${key}.json`, {
    version: bundle.version,
    generatedAt: bundle.generatedAt,
    entries: bundle.collections[key],
  });
}
for (const { schemaFile } of COLLECTIONS) {
  copyFileSync(
    path.join(REPO_ROOT, "schema", schemaFile),
    path.join(out, "schema", schemaFile),
  );
}

console.log(
  `Built data ${bundle.version} into ${path.relative(process.cwd(), out)}`,
);
