import { diffDatasets, renderMarkdown } from "../scripts/lib/diff.ts";
import { dataset, withCampaign } from "./helpers.ts";

test("no changes", () => {
  expect(diffDatasets(dataset(), dataset())).toEqual([]);
  expect(renderMarkdown([])).toContain("No data changes.");
});

test("describes changed fields in plain English, with linked names", () => {
  const head = withCampaign(dataset(), {
    status: "active",
    cohorts: ["care-homes"],
    summary: "A long\nmulti-line summary",
  });

  const md = renderMarkdown(diffDatasets(dataset(), head), {
    title: "Changes in this release",
  });

  expect(md).toBe(
    [
      "## Changes in this release",
      "",
      "### Campaigns",
      "",
      "- **Autumn COVID** changed `autumn-covid`",
      '  - Status changed from "planned" to "active"',
      '  - Eligible cohorts: added "Care home residents", removed "Over 75s"',
      "  - Summary text updated",
      "",
    ].join("\n"),
  );
});

test("lists added and removed entries", () => {
  const base = dataset();
  const head = dataset({
    vaccines: [
      ...base.vaccines,
      {
        id: "flu-vaccine",
        file: "vaccines/flu-vaccine.yaml",
        data: { name: "Flu vaccine", snomedCode: "1000000002" },
      },
    ],
    cohorts: base.cohorts.slice(0, 1),
  });

  const changes = diffDatasets(base, head);
  expect(changes.map((c) => [c.collection, c.id, c.kind])).toEqual([
    ["vaccines", "flu-vaccine", "added"],
    ["cohorts", "care-homes", "removed"],
  ]);
});
