import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import type { GlobalData } from "../../plugins/campaign-data";

const FILES = [
  ["bundle.json", "Every collection in one file"],
  ["campaigns.json", "Campaigns"],
  ["vaccines.json", "Vaccines"],
  ["cohorts.json", "Cohorts"],
  ["org-types.json", "Organisation types"],
];

const SCHEMAS = [
  "campaign.schema.json",
  "vaccine.schema.json",
  "cohort.schema.json",
  "org-type.schema.json",
];

function FileLinks({ version }: { version: string }) {
  const base = useBaseUrl(`/data/${version}/`);
  return (
    <ul>
      {FILES.map(([file, label]) => (
        <li key={file}>
          <a href={`${base}${file}`}>{file}</a>: {label}
        </li>
      ))}
      <li>
        JSON Schemas:{" "}
        {SCHEMAS.map((file, i) => (
          <span key={file}>
            {i > 0 && ", "}
            <a href={`${base}schema/${file}`}>{file}</a>
          </span>
        ))}
      </li>
    </ul>
  );
}

export default function DownloadsPage() {
  const { versions } = usePluginData("campaign-data") as GlobalData;
  const dataBase = useBaseUrl("/data/");
  return (
    <Layout title="Download the data">
      <main className="container margin-vert--lg">
        <h1>Download the data</h1>
        <p>
          Build against a released version and upgrade on purpose. See{" "}
          <Link to="/docs/developers/using-the-data/">Using the data</Link> for
          the file formats and versioning rules.
        </p>

        <h2>Latest release</h2>
        <FileLinks version="latest" />

        <h2>All releases</h2>
        {versions.length === 0 ? (
          <p>No releases yet.</p>
        ) : (
          <ul>
            {versions.map((v) => (
              <li key={v}>
                <a href={`${dataBase}${v}/bundle.json`}>{v}</a>
              </li>
            ))}
          </ul>
        )}
        <p>
          Each release is also attached to its{" "}
          <a href="https://github.com/OWNER/REPO/releases">GitHub release</a>.
        </p>
      </main>
    </Layout>
  );
}
