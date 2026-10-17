import { COLLECTIONS, type CollectionKey } from "./collections.ts";
import type { Dataset } from "./load.ts";

export interface Bundle {
  version: string;
  generatedAt: string;
  collections: Record<
    CollectionKey,
    ({ id: string } & Record<string, unknown>)[]
  >;
}

/**
 * The published, machine-readable form of the dataset. Entries keep their
 * links as IDs; consumers join them using the `id` of each entry.
 */
export function buildBundle(
  dataset: Dataset,
  version: string,
  generatedAt = new Date().toISOString(),
): Bundle {
  return {
    version,
    generatedAt,
    collections: Object.fromEntries(
      COLLECTIONS.map(({ key }) => [
        key,
        dataset[key].map((e) => ({ id: e.id, ...e.data })),
      ]),
    ) as Bundle["collections"],
  };
}
