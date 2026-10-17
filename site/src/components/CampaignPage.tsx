import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import type { Campaign, Cohort, OrgType, Vaccine } from "./types";

interface Props {
  data: {
    campaign: Campaign;
    summaryHtml: string;
    vaccines: Vaccine[];
    cohorts: Cohort[];
    orgTypes: OrgType[];
  };
}

export default function CampaignPage({ data }: Props) {
  const { campaign: c, summaryHtml, vaccines, cohorts, orgTypes } = data;
  return (
    <Layout title={c.name}>
      <main className="container margin-vert--lg">
        <p>
          <Link to="/campaigns/">All campaigns</Link>
        </p>
        <h1>{c.name}</h1>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>
                <code>{c.id}</code>
              </td>
            </tr>
            <tr>
              <th>Programme</th>
              <td>{c.programme}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{c.status}</td>
            </tr>
            <tr>
              <th>Runs</th>
              <td>
                {c.startDate} to {c.endDate}
              </td>
            </tr>
          </tbody>
        </table>

        {summaryHtml && (
          // Summaries are written by editors with write access to the repo.
          <div dangerouslySetInnerHTML={{ __html: summaryHtml }} />
        )}

        <h2>Vaccines</h2>
        <table>
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>SNOMED CT code</th>
              <th>Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>
                  <code>{v.snomedCode}</code>
                </td>
                <td>{v.manufacturer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Eligible cohorts</h2>
        <ul>
          {cohorts.map((co) => (
            <li key={co.id}>
              <strong>{co.name}</strong>: {co.description}
            </li>
          ))}
        </ul>

        <h2>Participating organisation types</h2>
        <ul>
          {orgTypes.map((o) => (
            <li key={o.id}>{o.name}</li>
          ))}
        </ul>

        {c.sources && c.sources.length > 0 && (
          <>
            <h2>Source documents</h2>
            <ul>
              {c.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url}>{s.title}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </Layout>
  );
}
