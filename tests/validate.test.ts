import { loadDataset } from "../scripts/lib/load.ts";
import { validateDataset } from "../scripts/lib/validate.ts";
import { dataset, withCampaign } from "./helpers.ts";

const errors = (issues: ReturnType<typeof validateDataset>) =>
  issues.map((i) => i.message);

test("the data in the repository is valid for a release", () => {
  expect(validateDataset(loadDataset())).toEqual([]);
});

test("a valid dataset has no issues", () => {
  expect(validateDataset(dataset())).toEqual([]);
});

test("schema problems are errors", () => {
  const issues = validateDataset(withCampaign(dataset(), { status: "maybe" }));
  expect(errors(issues)).toEqual([
    "/status must be equal to one of the allowed values",
  ]);
});

test("links to missing entries are errors", () => {
  const issues = validateDataset(
    withCampaign(dataset(), { cohorts: ["over-75s", "nobody"] }),
  );
  expect(errors(issues)).toEqual([
    '/cohorts refers to "nobody", which is not in cohorts',
  ]);
});

test("end date must not be before start date", () => {
  const issues = validateDataset(
    withCampaign(dataset(), { endDate: "2026-01-01" }),
  );
  expect(errors(issues)).toEqual([
    "/endDate (2026-01-01) is before /startDate (2026-10-01)",
  ]);
});

test("file names must be lower-case and hyphenated", () => {
  const data = dataset();
  data["org-types"][0] = { ...data["org-types"][0], id: "Pharmacy_1" };
  data.campaigns[0].data.orgTypes = ["Pharmacy_1"];
  expect(errors(validateDataset(data))).toEqual([
    'file name "Pharmacy_1" must be lower-case words separated by hyphens',
  ]);
});
