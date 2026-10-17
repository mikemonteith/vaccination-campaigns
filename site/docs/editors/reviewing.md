---
sidebar_position: 2
title: Reviewing changes
---

# Reviewing changes

There are two kinds of review.

## 1. Reviewing an editor's change

This happens in the [editor](pathname:///admin/), on the
**Editorial Workflow** board.

1. Open a change in the **In Review** column.
2. Check the entry. The preview on the right shows how it will read.
3. Either:
   - move it to **Ready** and choose **Publish** to accept it into staging, or
   - move it back to **Draft** and tell the editor what to change.

Accepted changes appear on the [staging preview site](pathname:///staging/)
within a few minutes. Its **Changes** page lists everything waiting for the
next release, in plain English.

## 2. Approving a release

Releases are approved by the **data owner**. A maintainer opens a release
request (a GitHub pull request from staging into main) and asks you to review
it. You'll get an email from GitHub with a link.

You don't need to read any code. The pull request has a comment called
**Changes in this release** that lists every change in plain English, and a
link to the staging preview site.

1. Read the **Changes in this release** comment.
2. Check anything you're unsure of on the staging preview site.
3. On the pull request, choose **Files changed**, then **Review changes**.
4. Choose **Approve** and **Submit review**. If something is wrong, choose
   **Request changes** instead and say what.

Once you approve, a maintainer publishes the release.
