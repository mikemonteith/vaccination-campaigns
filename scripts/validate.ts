// Validate the data against the schemas and check links between entries.
//
//   npm run validate
//   npm run validate -- --data <dir>   validate another copy of the data
import { parseArgs } from "node:util";
import { loadDataset } from "./lib/load.ts";
import { validateDataset } from "./lib/validate.ts";

const { values } = parseArgs({
  options: {
    data: { type: "string" },
  },
});

const issues = validateDataset(loadDataset(values.data));

for (const issue of issues) {
  console.error(`ERROR ${issue.file}: ${issue.message}`);
  // Annotate the commit or pull request when running in GitHub Actions.
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::error file=data/${issue.file}::${issue.message}`);
  }
}

console.log(`${issues.length} error(s)`);
process.exit(issues.length ? 1 : 0);
