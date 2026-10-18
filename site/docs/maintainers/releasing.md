---
sidebar_position: 2
title: Publishing a release
---

# Publishing a release

Editors' changes reach `main` through their change requests (see
[Approving changes](../editors/reviewing.md)). Once approved and merged, they
show on the site straight away. A release is a snapshot of `main` that
teams can build against.

1. **Check nothing is half-way.** Look at the [Changes](pathname:///changes/)
   page on the site: it lists every approved change since the last release.
   If an editor's change request is nearly ready, you may want to wait for
   it.
2. **Merge change requests with a merge commit**, not squash, when you can.
   Squashing works, but a merge commit lets the editor's workspace move
   straight on to the approved data.
3. **Publish the release.** On GitHub, go to Releases → **Draft a new
   release**, create a tag such as `v2026.1` on `main`, and publish it. The
   `Release` workflow then:
   - checks the data again,
   - builds the JSON files and attaches them to the release,
   - adds the change summary (since the previous release) to the release
     notes, and
   - redeploys the site so the new version appears under `/data/`.
4. **Tell people.** Send the release link to the teams that use the data.
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
5. Open a pull request into `main`, and say in the release notes how
   consumers are affected.

When it's merged, the Editor branches workflow brings every editor's
workspace up to date with it. If the change touches `.github/workflows/`,
GitHub doesn't let a workflow do that, so merge `main` into each `edits/*`
branch yourself.
