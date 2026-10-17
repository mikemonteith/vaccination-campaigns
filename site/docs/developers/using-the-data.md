---
sidebar_position: 1
title: Using the data
---

# Using the data

## Where to get it

Every release is published in two places:

- on this site, at fixed URLs:
  `https://OWNER.github.io/REPO/data/<version>/bundle.json`
  (`latest` always points to the newest release), and
- as files attached to the
  [GitHub release](https://github.com/OWNER/REPO/releases).

See the [downloads page](pathname:///data/) for links. Build against a
specific version, not `latest`, so that your system only changes when you
upgrade it.

## Files

| File                   | Contents                                      |
| ---------------------- | --------------------------------------------- |
| `bundle.json`          | Every collection in one file                  |
| `<collection>.json`    | One collection: `{ version, entries: [...] }` |
| `schema/*.schema.json` | JSON Schema (2020-12) for each collection     |

`bundle.json` looks like this:

```json
{
  "version": "v2026.1",
  "generatedAt": "2026-10-17T09:00:00.000Z",
  "collections": {
    "campaigns": [{ "id": "...", "name": "...", "vaccines": ["..."] }],
    "vaccines": [{ "id": "...", "name": "...", "snomedCode": "..." }],
    "cohorts": [],
    "org-types": []
  }
}
```

Every entry has a stable `id`. Entries link to each other by ID: for example
a campaign's `vaccines` is a list of IDs from the `vaccines` collection. In
the schemas, a property that holds links has an `x-references` annotation
naming the collection it links to.

## Versions

Versions are named `vYYYY.N`, for example `v2026.1` for the first release of 2026. Each release's notes list what changed, in plain English, and say if
anything changed in a way that could break a consumer (such as a renamed or
removed field).

## Source

The source data is YAML in the `data/` folder of the
[repository](https://github.com/OWNER/REPO). Use the released files rather
than reading the repository directly: the repository includes changes that
haven't been released.
