---
sidebar_position: 1
title: Editing the data
---

# Editing the data

You change the data in the editor. You don't need to know anything about Git
or GitHub, but you do need a GitHub account with access to the repository,
and a workspace of your own. Ask a maintainer if you don't have them.

## Sign in

1. Open the [editor](pathname:///admin/).
2. The first time, choose your name from the list (or type your GitHub
   username). The editor remembers it on this device.
3. Choose **Sign in with GitHub**.

## Make your changes

1. Choose a collection on the left: **Campaigns**, **Vaccines**, **Cohorts**
   or **Organisation types**.
2. Open an entry to change it, or choose **New** to add one.
3. Fill in the form. Fields with links to other data (such as a campaign's
   vaccines) let you pick from a list. If what you need isn't in the list,
   add it to its own collection first, then come back.
4. **Save**.

Make as many changes as you need, across any collections. They're saved in
**your own workspace**. Other editors don't see them, and nothing is released
until the data owner approves.

## Send them for approval

You don't need to do anything. After your first save, a **change request**
called "Changes from _your username_" is opened for you, listing every
change in your workspace in plain English, and the data owner is asked to
review it. It updates itself each time you save. When you've finished, tell
the data owner it's ready.

If the data owner asks for changes, make them in the editor in the same way.

Once your changes are approved, your workspace starts afresh from the latest
approved data, ready for your next set of changes. Other editors' approved
changes also appear in your workspace automatically.

## Things to know

- **Finish one set of changes before starting the next.** Everything in your
  workspace is approved together.
- **Names and IDs**: an entry's ID is made from its name when you first save
  it, and doesn't change if you rename the entry later. Other entries link to
  it by ID, so don't delete and re-create an entry to rename it.
- **Deleting**: don't delete an entry that other entries still link to.
  Remove the links first. The checks will flag it if you do.
- **Using someone else's computer?** Open the editor with `?switch` at the
  end of its address to choose a different name.
