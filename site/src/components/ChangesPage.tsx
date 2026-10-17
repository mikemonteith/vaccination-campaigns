import Layout from "@theme/Layout";
import type { ChangeSummary } from "./types";

export default function ChangesPage({
  changes: { summary: changes },
}: {
  changes: { summary: ChangeSummary | null };
}) {
  const groups = new Map<string, ChangeSummary["changes"]>();
  for (const c of changes?.changes ?? []) {
    groups.set(c.collectionLabel, [
      ...(groups.get(c.collectionLabel) ?? []),
      c,
    ]);
  }

  return (
    <Layout title="Changes">
      <main className="container margin-vert--lg">
        <h1>{changes?.title ?? "Changes"}</h1>
        {!changes && <p>This build has no change summary.</p>}
        {changes && changes.changes.length === 0 && <p>No data changes.</p>}
        {Array.from(groups).map(([label, items]) => (
          <section key={label}>
            <h2>{label}</h2>
            <ul>
              {items.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> {c.kind} <code>{c.id}</code>
                  {c.fields.length > 0 && (
                    <ul>
                      {c.fields.map((f) => (
                        <li key={f.description}>{f.description}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </Layout>
  );
}
