# Vaccination campaign data

The rules for each NHS vaccination campaign (vaccines, SNOMED CT codes,
eligible cohorts, participating organisation types) as versioned,
machine-readable data with a human-readable website.

- **Editors** change the data in a web editor ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)).
  No Git knowledge needed.
- **Data owners** approve each release.
- **Consumers** (systems, developers, people) use versioned JSON files with
  JSON Schemas, or read the website.

Everything is static and hosted on GitHub Pages. There is no server to run.

> **The data in `data/` is placeholder data** showing the shape of each
> collection. The schemas are deliberately minimal and expected to change.

## How changes flow

```
 Editor (Sveltia CMS, /admin/)
   │  each editor saves to their own branch, edits/<username>
   │  CI: checks on every save
   ▼
 "Changes from <editor>" pull request into main, opened and kept up to
 date automatically with a plain-English summary of every change
   │  approved by the data owner (CODEOWNERS)
   ▼
 main ─────────────────► website (/), "Changes" page lists approved changes since the last release
   │  GitHub release vYYYY.N
   ▼
 Release workflow ─────► JSON files attached to the release, and at /data/<version>/
```

## Repository layout

| Path                            | What                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `data/<collection>/*.yaml`      | The source data. One file per entry; the file name is its ID |
| `schema/*.schema.json`          | JSON Schemas: **the contract**. `x-references` marks links   |
| `scripts/`                      | Validation, change summary, data build, CMS config check     |
| `site/`                         | Docusaurus website, guides and the CMS (`site/static/admin`) |
| `site/plugins/campaign-data.ts` | Turns the data into website pages                            |
| `.github/workflows/`            | CI, release and deploy                                       |

## Commands

```sh
npm ci
npm run validate            # data checks: schemas, links, dates
npm run check:cms           # CMS config matches the schemas and Sveltia's own schema
npm run diff -- --base <dir> # plain-English summary of changes against another copy of data/
npm run build:data          # JSON files into dist/data
npm run site:start          # website at http://localhost:3000
npm run build               # data + website into build/
npm test                    # unit tests
npm run typecheck
npm run format              # run before committing; CI checks formatting
```

To try the editor locally, run `npm run site:start`, open
http://localhost:3000/admin/ in Chrome or Edge, and choose **Work with Local
Repository**. Sveltia then edits the files in your working copy directly.

## Guides

The guides are part of the website, in `site/docs/`:

- [Editing the data](site/docs/editors/editing.md) and
  [approving changes](site/docs/editors/reviewing.md)
- [Using the data](site/docs/developers/using-the-data.md)
- [Setting up the repository](site/docs/maintainers/setup.md): do this first
- [Publishing a release](site/docs/maintainers/releasing.md), including how to
  change the schema
