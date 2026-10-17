import Layout from "@theme/Layout";
import type { Cohort, OrgType, Vaccine } from "./types";

interface Props {
  reference: { vaccines: Vaccine[]; cohorts: Cohort[]; orgTypes: OrgType[] };
}

const ages = (c: Cohort) =>
  c.minAgeYears === undefined && c.maxAgeYears === undefined
    ? ""
    : `${c.minAgeYears ?? 0} to ${c.maxAgeYears ?? "any"}`;

export default function ReferencePage({ reference }: Props) {
  const { vaccines, cohorts, orgTypes } = reference;
  return (
    <Layout title="Reference data">
      <main className="container margin-vert--lg">
        <h1>Reference data</h1>
        <p>The vaccines, cohorts and organisation types campaigns link to.</p>

        <h2 id="vaccines">Vaccines</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SNOMED CT code</th>
              <th>Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((v) => (
              <tr key={v.id}>
                <td>
                  <code>{v.id}</code>
                </td>
                <td>{v.name}</td>
                <td>
                  <code>{v.snomedCode}</code>
                </td>
                <td>{v.manufacturer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="cohorts">Cohorts</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Ages</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.id}>
                <td>
                  <code>{c.id}</code>
                </td>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>{ages(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="org-types">Organisation types</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {orgTypes.map((o) => (
              <tr key={o.id}>
                <td>
                  <code>{o.id}</code>
                </td>
                <td>{o.name}</td>
                <td>{o.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Layout>
  );
}
