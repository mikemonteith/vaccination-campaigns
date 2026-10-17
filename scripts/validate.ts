// Validate the data against the schemas and check links between entries.
//
//   npm run validate                 strict: what a release needs
//   npm run validate -- --lenient    draft changes: incomplete entries are warnings
//   npm run validate -- --data <dir> validate another copy of the data
import { parseArgs } from "node:util";
import { loadDataset } from "./lib/load.ts";
import { validateDataset } from "./lib/validate.ts";

const { values } = parseArgs({
  options: {
    lenient: { type: "boolean", default: false },
    data: { type: "string" },
  },
});

const issues = validateDataset(loadDataset(values.data), {
  lenient: values.lenient,
});
const errors = issues.filter((i) => i.level === "error");

for (const issue of issues) {
  const line = `${issue.level.toUpperCase()} ${issue.file}: ${issue.message}`;
  if (issue.level === "error") console.error(line);
  else console.warn(line);
  // Annotate the pull request when running in GitHub Actions.
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::${issue.level} file=data/${issue.file}::${issue.message}`);
  }
}

console.log(
  `${errors.length} error(s), ${issues.length - errors.length} warning(s)`,
);
process.exit(errors.length ? 1 : 0);
