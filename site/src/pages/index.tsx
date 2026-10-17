import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import Layout from "@theme/Layout";
import type { GlobalData } from "../../plugins/campaign-data";

export default function Home() {
  const { version, counts } = usePluginData("campaign-data") as GlobalData;
  return (
    <Layout title="Home">
      <main className="container margin-vert--lg">
        <h1>Vaccination campaign data</h1>
        <p>
          The rules for each vaccination campaign: which vaccines and SNOMED CT
          codes are used, which cohorts are eligible and which types of
          organisation take part. This is version <strong>{version}</strong>.
        </p>
        <ul>
          <li>
            <Link to="/campaigns/">{counts.campaigns ?? 0} campaigns</Link>
          </li>
          <li>
            <Link to="/reference/">Reference data</Link>: {counts.vaccines ?? 0}{" "}
            vaccines, {counts.cohorts ?? 0} cohorts, {counts["org-types"] ?? 0}{" "}
            organisation types
          </li>
          <li>
            <Link to="/changes/">What changed</Link>
          </li>
          <li>
            <Link to="/data/">Download the data</Link> (JSON, with schemas)
          </li>
        </ul>
        <p>
          <Link to="/docs/">Guides</Link> for editors, reviewers, developers and
          maintainers.
        </p>
      </main>
    </Layout>
  );
}
