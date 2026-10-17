---
sidebar_position: 2
title: Publishing a release
---

# Publishing a release

1. **Open the release request.** Open a pull request from `staging` into
   `main` titled, for example, "Release v2026.1". CI checks the data strictly
   (every field filled in, every link valid) and posts a **Changes in this
   release** comment.
2. **Fix any problems** on `staging`, through the editor or a pull request.
3. **Get approval.** Request a review from the data owner. Point them at the
   [reviewing guide](../editors/reviewing.md).
4. **Merge** the pull request once it's approved and green. Use a merge
   commit, not squash, so `staging` and `main` keep a shared history.
5. **Publish the release.** On GitHub, go to Releases → **Draft a new
   release**, create a tag such as `v2026.1` on `main`, and publish it. The
   `Release` workflow then:
   - checks the data again,
   - builds the JSON files and attaches them to the release,
   - adds the change summary (since the previous release) to the release
     notes, and
   - redeploys the site so the new version appears under `/data/`.
6. **Tell people.** Send the release link to the teams that use the data.
   Say whether anything changed in a way that could break their systems.

## Version numbers

Use `vYYYY.N`: the year, then a number that goes up with each release that
year. Call out anything that could break consumers in the release notes, such
as a renamed or removed field or a change to what a field means.

## Changing the schema

The JSON Schemas in `schema/` are the contract with consumers. To change one:

1. Change the schema.
2. Change the matching collection in `site/static/admin/config.yml`.
   `npm run check:cms` fails until the two match.
3. Update the existing data so `npm run validate` passes.
4. Update the site pages in `site/src/components/` if they show the field.
5. Open a pull request into `staging`, and say in the release notes how
   consumers are affected.
