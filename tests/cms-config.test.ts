import { readFileSync } from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";
import { CMS_DIR, checkCmsConfig } from "../scripts/lib/cms-config.ts";

const config = readFileSync(path.join(CMS_DIR, "config.yml"), "utf8");

test("the CMS config matches the schemas", () => {
  expect(checkCmsConfig(config)).toEqual([]);
});

test("a field missing from the CMS is reported", () => {
  const parsed = parse(config);
  const vaccines = parsed.collections.find(
    (c: { name: string }) => c.name === "vaccines",
  );
  vaccines.fields = vaccines.fields.filter(
    (f: { name: string }) => f.name !== "manufacturer",
  );
  expect(checkCmsConfig(stringify(parsed))).toContain(
    'vaccines: schema property "manufacturer" has no CMS field',
  );
});

test("a required field that is optional in the CMS is reported", () => {
  const broken = config.replace(
    "{ name: startDate, label: Start date, widget: datetime, type: date }",
    "{ name: startDate, label: Start date, widget: datetime, type: date, required: false }",
  );
  expect(checkCmsConfig(broken)).toContain(
    "campaigns.startDate: required in the schema but optional in the CMS",
  );
});

test("a relation to the wrong collection is reported", () => {
  const broken = config.replace("collection: org-types", "collection: cohorts");
  expect(checkCmsConfig(broken)).toContain(
    'campaigns.orgTypes: should be a relation to the "org-types" collection (schema x-references)',
  );
});

test("select options that differ from the schema enum are reported", () => {
  const broken = config.replace(
    "          - { label: Closed, value: closed }\n",
    "",
  );
  expect(checkCmsConfig(broken)).toContain(
    "campaigns.status: select options should match the schema enum",
  );
});

test("options Sveltia doesn't know are reported", () => {
  const broken = config.replace(
    "publish_mode: simple",
    "publish_mode: simple\nnot_an_option: true",
  );
  expect(checkCmsConfig(broken).join("\n")).toContain('"not_an_option"');
});
