import type { Dataset, Entry } from "../scripts/lib/load.ts";

const entry = (
  collection: string,
  id: string,
  data: Record<string, unknown>,
): Entry => ({ id, file: `${collection}/${id}.yaml`, data });

/** A small valid dataset; pass overrides to change one collection. */
export function dataset(overrides: Partial<Dataset> = {}): Dataset {
  return {
    campaigns: [
      entry("campaigns", "autumn-covid", {
        name: "Autumn COVID",
        programme: "covid-19",
        status: "planned",
        startDate: "2026-10-01",
        endDate: "2027-01-31",
        vaccines: ["covid-vaccine"],
        cohorts: ["over-75s"],
        orgTypes: ["pharmacy"],
      }),
    ],
    vaccines: [
      entry("vaccines", "covid-vaccine", {
        name: "COVID vaccine",
        snomedCode: "1000000001",
      }),
    ],
    cohorts: [
      entry("cohorts", "over-75s", {
        name: "Over 75s",
        description: "Aged 75 or over",
      }),
      entry("cohorts", "care-homes", {
        name: "Care home residents",
        description: "Residents",
      }),
    ],
    "org-types": [entry("org-types", "pharmacy", { name: "Pharmacy" })],
    ...overrides,
  };
}

export function withCampaign(
  base: Dataset,
  changes: Record<string, unknown>,
): Dataset {
  const [c] = base.campaigns;
  return { ...base, campaigns: [{ ...c, data: { ...c.data, ...changes } }] };
}
