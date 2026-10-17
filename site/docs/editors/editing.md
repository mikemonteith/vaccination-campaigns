---
sidebar_position: 1
title: Editing the data
---

# Editing the data

You change the data in the editor. You don't need to know anything about Git
or GitHub, but you do need a GitHub account with access to the repository.
Ask a maintainer if you don't have one.

## Sign in

Open the [editor](pathname:///admin/) and choose **Sign in with GitHub**.

## Make a change

1. Choose a collection on the left: **Campaigns**, **Vaccines**, **Cohorts**
   or **Organisation types**.
2. Open an entry to change it, or choose **New** to add one.
3. Fill in the form. Fields with links to other data (such as a campaign's
   vaccines) let you pick from a list. If what you need isn't in the list,
   add it to its own collection first.
4. **Save**. Your change is saved as a **draft**. Nobody else is affected yet.

## Send it for review

When your change is ready, change its status from **Draft** to
**In Review**. A reviewer will check it. You can see where every change is on
the **Editorial Workflow** board.

If the reviewer asks for changes, they'll move it back to **Draft**. Make the
changes, save, and move it to **In Review** again.

## Things to know

- **Changes that go together**: each entry you change is reviewed separately.
  If a new campaign needs a new cohort, tell the reviewer so they approve both.
- **Names and IDs**: an entry's ID is made from its name when you first save
  it, and doesn't change if you rename the entry later. Other entries link to
  it by ID, so don't delete and re-create an entry to rename it.
- **Deleting**: you can't delete an entry that other entries still link to.
  Remove the links first.
