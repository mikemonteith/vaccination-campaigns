import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import type { Campaign } from "./types";

export default function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  const sorted = [...campaigns].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
  return (
    <Layout title="Campaigns">
      <main className="container margin-vert--lg">
        <h1>Campaigns</h1>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Programme</th>
              <th>Status</th>
              <th>Runs</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/campaigns/${c.id}/`}>{c.name}</Link>
                </td>
                <td>{c.programme}</td>
                <td>{c.status}</td>
                <td>
                  {c.startDate} to {c.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Layout>
  );
}
