---
sidebar_position: 1
slug: /
title: About this data
---

# About this data

This site publishes the rules for each NHS vaccination campaign: which
vaccines and SNOMED CT codes are used, which cohorts of patients are eligible
and which types of organisation can take part.

It is the single source for that information. Teams that build services
around vaccination campaigns (for example recording, payments and booking)
take a released version of the data and build against it.

## How it fits together

1. **Editors** change the data in the [editor](pathname:///admin/). Each
   editor works in their own workspace.
2. Each editor's changes are gathered into one **change request**, which
   the data owner reviews and approves. Approved changes appear on this site
   straight away.
3. A maintainer publishes a **release** when it's time: a version number,
   release notes and downloadable files.
4. Teams are told about the release and update their systems when they are
   ready.

## Guides

- [Editing the data](./editors/editing.md)
- [Approving changes](./editors/reviewing.md)
- [Using the data](./developers/using-the-data.md) (for developers)
- [Setting up the repository](./maintainers/setup.md) and
  [publishing a release](./maintainers/releasing.md) (for maintainers)
