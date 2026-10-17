// Describe what changed between two copies of the data, in plain English.
//
//   npm run diff -- --base <dir> [--head data] [--title "..."] [--json out.json]
//
// Markdown goes to stdout (used for PR comments and release notes). With
// --json the structured changes are also written for the docs site.
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { describeField, diffDatasets, renderMarkdown } from "./lib/diff.ts";
import { loadDataset } from "./lib/load.ts";

const { values } = parseArgs({
  options: {
    base: { type: "string" },
    head: { type: "string" },
    title: { type: "string" },
    json: { type: "string" },
  },
});

if (!values.base) {
  console.error("--base <data dir> is required");
  process.exit(2);
}

const changes = diffDatasets(
  loadDataset(values.base),
  loadDataset(values.head),
);
if (values.json) {
  // Include the sentence for each field so the site doesn't need this code.
  const withText = changes.map((c) => ({
    ...c,
    fields: c.fields.map((f) => ({ ...f, description: describeField(f) })),
  }));
  writeFileSync(
    values.json,
    JSON.stringify(
      { title: values.title ?? "Changes", changes: withText },
      null,
      2,
    ) + "\n",
  );
}
process.stdout.write(renderMarkdown(changes, { title: values.title }));
