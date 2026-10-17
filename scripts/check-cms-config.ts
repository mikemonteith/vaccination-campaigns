// Check that the CMS editing forms match the JSON Schemas.
import { checkCmsConfig } from "./lib/cms-config.ts";

const problems = checkCmsConfig();
for (const p of problems) console.error(p);
console.log(
  problems.length
    ? `${problems.length} problem(s) in site/static/admin/config.yml`
    : "CMS config matches the schemas",
);
process.exit(problems.length ? 1 : 0);
