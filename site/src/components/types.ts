// Shapes of the data the campaign-data plugin passes to these pages.

export interface Ref {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Campaign extends Ref {
  programme: string;
  status: string;
  startDate: string;
  endDate: string;
  summary?: string;
  sources?: { title: string; url: string }[];
}

export interface Vaccine extends Ref {
  manufacturer?: string;
  snomedCode: string;
  description?: string;
}

export interface Cohort extends Ref {
  description: string;
  minAgeYears?: number;
  maxAgeYears?: number;
}

export interface OrgType extends Ref {
  description?: string;
}

export interface ChangeSummary {
  title: string;
  changes: {
    collectionLabel: string;
    id: string;
    name: string;
    kind: "added" | "removed" | "changed";
    fields: { description: string }[];
  }[];
}
