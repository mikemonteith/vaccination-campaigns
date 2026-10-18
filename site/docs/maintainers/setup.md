---
sidebar_position: 1
title: Setting up the repository
---

# Setting up the repository

One-off setup for a new copy of this repository.

## 1. Fill in the placeholders

- `site/static/admin/config.yml`: set `backend.base_url` to your sign-in
  service (step 4). It's `EXAMPLE` until then.
- `.github/CODEOWNERS`: the people (or, in an organisation, the teams) who
  maintain the repository and who approve data changes.

If the repository moves or is renamed, also update `backend.repo` and
`site_url` in `site/static/admin/config.yml`, the default `url` in
`site/docusaurus.config.ts`, and the links in `site/docs/` and
`site/src/components/DownloadsPage.tsx`.

## 2. Branches

- Protect **`main`** (Settings → Rules → Rulesets):
  - require a pull request before merging, with **1 approval**, and
    **review from Code Owners**,
  - require the **checks** status check to pass,
  - block force pushes and deletion.
- **Don't protect editors' branches** (`edits/*`). The editor saves by
  committing straight to them, and the Editor branches workflow updates them.
- Allow the workflows to open pull requests: Settings → Actions → General →
  **Allow GitHub Actions to create and approve pull requests**.

## 3. GitHub Pages

Settings → Pages → Source: **GitHub Actions**. The `Deploy site` workflow
publishes the site (built from `main`) at the root, the editor at `/admin/`
and every release's data files under `/data/`.

## 4. Sign-in for the editor

The editor needs a small OAuth service to sign people in with GitHub. Use
[Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth), a
free Cloudflare Worker:

1. Deploy the worker by following its README.
2. Create a GitHub OAuth app (Settings → Developer settings → OAuth Apps)
   with the worker's `/callback` URL. If you can, create it under the
   organisation rather than a personal account.
3. Give the worker the OAuth app's client ID and secret, and set
   `ALLOWED_DOMAINS` to your Pages domain.
4. Put the worker's URL in `backend.base_url` in
   `site/static/admin/config.yml`.

## 5. People

- **Editors** need write access to the repository (Settings →
  Collaborators) and a workspace: run **Actions → Editor branches → Run
  workflow** with their GitHub username. That creates their branch,
  `edits/<username>`.
- **Data owners** (who approve change requests) are the code owners of
  `/data/` in `.github/CODEOWNERS`.
- **Maintainers** (who change schemas and publish releases) are the code
  owners of everything else.
