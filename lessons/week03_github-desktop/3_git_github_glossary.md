# Git and GitHub glossary

Use this as a reference beside the [Git basics lesson](1_github_basics.md) and
the [team project lesson](2_project_repo.md).
Click a linked term inside a definition to jump to its explanation. You can
also use Cmd+F on a Mac or Ctrl+F on Windows to find a word. This is a reference
page; you don't need to memorise it.

- [The tools and the project folder](#the-tools-and-the-project-folder)
- [Saving and recording changes](#saving-and-recording-changes)
- [Moving work between your computer and GitHub](#moving-work-between-your-computer-and-github)
- [Branches and pull requests](#branches-and-pull-requests)
- [Conflicts and unfinished work](#conflicts-and-unfinished-work)
- [People and permissions](#people-and-permissions)
- [Project files and websites](#project-files-and-websites)
- [Other terms you may see in menus](#other-terms-you-may-see-in-menus)

## The tools and the project folder

### Git

Software that records the [history](#history) of some project's files. You can use Git on
your computer while offline, before putting anything on [GitHub](#github).

### GitHub

A website that hosts [Git](#git) [repositories](#repository-or-repo) and provides tools for discussing and
[reviewing](#review-approve-and-request-changes) work. GitHub holds the online copy we use in class.

### GitHub Desktop

An app that lets you work with [Git](#git) and [GitHub](#github) through buttons and menus.
VS Code is where you edit the files; Desktop is where you inspect and record
those edits in this lesson.

### Version control

Keeping a record of changes so you can compare versions, see who changed
something, and recover earlier work. [Git](#git) is one version-control system.

### Repository, or repo

A project whose files and [history](#history) are tracked by [Git](#git). A repo can contain code,
notes, images, and data. On your computer it usually looks like an ordinary
folder, with Git's records in a hidden `.git` folder.

### Local repository

The [repository](#repository-or-repo) on your computer. Your local [commits](#commit) exist here even before
you publish anything to [GitHub](#github).

### Remote repository

Another copy of the [repository](#repository-or-repo) that you exchange [commits](#commit) with. In our class,
it is the shared copy on [GitHub](#github). Changes do not travel between copies by
themselves.

### Working directory, working tree, or working copy

The files you can open and edit in the project folder right now. They reflect
the [branch](#branch) you have selected, plus any edits you haven't [committed](#commit).

### Root directory

The top level of the project folder. "Put the note in the repository root"
means beside the main [README](#readme-and-markdown), rather than inside `data/` or `notebooks/`.

## Saving and recording changes

### Save

Write your editor's changes to the file on your computer. [Git](#git) can see the
saved edits, but you still need to [commit](#commit) them to record a checkpoint.

### Changes

In [Desktop](#github-desktop), the tab showing new, edited, or deleted files that you haven't
[committed](#commit). Deleting a [tracked file](#tracked-and-untracked-files) is a change too: a commit can record its
removal.

### Diff

A comparison between versions. In [Desktop](#github-desktop) and [GitHub](#github), red usually shows
removed lines and green shows added lines. Read the words or code, not just
the colours: a one-word edit can change the meaning of a result.

### Stage, staging area, or index

Prepare the changes that will go into the next [commit](#commit). In [Desktop](#github-desktop), the
checkboxes beside files let you choose what to include when you commit.
"Index" is [Git](#git)'s technical name for its staging area.

### Commit

A recorded checkpoint in the [repository](#repository-or-repo)'s [history](#history). It captures a version of
the [tracked files](#tracked-and-untracked-files), built from the changes you selected. A commit made on your
computer stays local until you [push](#push) it.

### Snapshot

The version of the [tracked files](#tracked-and-untracked-files) recorded by a [commit](#commit). [Git](#git) keeps these
versions without making you manage a separate folder for each one.

### Commit message

The explanation attached to a [commit](#commit). `Add the proposed data source` tells a
teammate more than `update`. [Desktop](#github-desktop) calls the short first line the Summary.

### Commit ID, hash, or SHA

The letters and numbers [Git](#git) uses to identify a particular [commit](#commit). [GitHub](#github) often
shows an abbreviated version, such as `a1b2c3d`. It lets you point to an exact
checkpoint rather than saying "the version from yesterday".

### History

The [commits](#commit) leading to the version you are viewing. Open [Desktop](#github-desktop)'s History
tab to inspect their messages and [diffs](#diff); unfinished edits are under [Changes](#changes).

### Tracked and untracked files

A tracked file is one [Git](#git) already knows about. A new file is untracked until
you add it for a [commit](#commit). Putting a file in the project folder is only the
first step toward including it in Git [history](#history).

### Uncommitted changes

[Saved](#save) edits that haven't been recorded in a [commit](#commit). They appear under [Changes](#changes)
in [Desktop](#github-desktop), and [pushing](#push) won't send them to [GitHub](#github).

### Clean working tree

[Git](#git) sees no changes waiting to be [committed](#commit) and no [untracked files](#tracked-and-untracked-files) to add.
You can still have commits waiting to be [pushed](#push). "Clean" describes your files,
not whether your work is online.

For more detail on file states, see Git's
[guide to recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository).

## Moving work between your computer and GitHub

### Origin

The usual nickname for a [repository](#repository-or-repo)'s [remote](#remote-repository) connection. In [`Push origin`](#push),
[Desktop](#github-desktop) is saying "send my [commits](#commit) to the repository at this [saved](#save) address".
`origin` is a name, not another [GitHub](#github) account.

### Publish repository

A [Desktop](#github-desktop) action that creates a [GitHub](#github) [repository](#repository-or-repo) from your local one and
connects the two. After this first publication, you normally use [Push origin](#push)
to send further [commits](#commit).

### Push

Send local [commits](#commit) to the [remote](#remote-repository) and update its [branch](#branch). If you edit a file
but haven't committed it, pushing won't include that edit.

### Fetch

Download information and [commits](#commit) from the [remote](#remote-repository) so [Git](#git) can see what's new.
Fetching leaves your [working files](#working-directory-working-tree-or-working-copy) unchanged; it lets you check before
bringing changes into your current [branch](#branch).

### Pull

[Fetch](#fetch) [remote](#remote-repository) [commits](#commit) and integrate them into your current local [branch](#branch).
Your [working files](#working-directory-working-tree-or-working-copy) can change as a result. This is how your teammate's [pushed](#push)
work reaches the files you open on your computer.

### Sync

A general word for bringing copies up to date. Check the direction: [push](#push)
sends your [commits](#commit) out; [pull](#pull) brings [remote](#remote-repository) commits in.

### Ahead, behind, or diverged

These [compare](#compare-branch-or-head-branch) a [branch](#branch) with another branch, often its [remote](#remote-repository) counterpart.
"Ahead by 2" means you have two [commits](#commit) the other branch lacks. "Behind by 1"
means it has a commit you lack. If both have their own new commits, they have
diverged. [Fetch](#fetch) first so the comparison uses recent information.

### Clone

Create a local copy of an existing [repository](#repository-or-repo), including its [Git](#git) [history](#history) and
a connection back to the [remote](#remote-repository). Each teammate clones the shared team repo
onto their own computer.

### Fork

A separate [repository](#repository-or-repo) on [GitHub](#github), created from an
existing project with its [history](#history) and a link to the original.
**Forking** is the action of creating that copy under your account. For example,
Tom can fork `dlab-berkeley/Git-Playground` to create
`tomvannuenen/Git-Playground`.

You can [push](#push) changes to your fork without changing the original. To
propose those changes back, open a [pull request](#pull-request-or-pr) from a
[branch](#branch) in your fork to a branch in the original. This is useful when
you do not have permission to edit the original directly. Forking creates the
copy on GitHub; [cloning](#clone) brings a copy onto your computer. A fork can
have several branches. [GitHub's guide to forks](https://docs.github.com/en/pull-requests/reference/forks).

### Template

A [repository](#repository-or-repo) used as a starting set of files for a new project. A template
copy starts a fresh [history](#history). For our team project, one person creates the
repository from the template; everyone else [clones](#clone) that new team repository.

### Upstream

Usually the [branch](#branch) your local branch is set to exchange work with, such as
[`origin/main`](#remote-tracking-branch-such-as-originmain). In a [fork](#fork), people also use "upstream" for the original project
and often give its [remote](#remote-repository) connection that name. The context matters.

### Remote-tracking branch, such as origin/main

Your local record of where the [remote](#remote-repository) [branch](#branch) was at the last [fetch](#fetch) or other
update. It isn't a live view of [GitHub](#github). Your local [`main`](#main-and-default-branch) can be at a different
[commit](#commit) until you bring the changes together.

[Git](#git)'s [guide to remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
explains these connections in more detail.

## Branches and pull requests

### Branch

A named line of development, starting from an existing [commit](#commit). If you add
`question.md` and commit it on `add-question`, the file belongs to that
branch's [history](#history). [Switch](#checkout-or-switch) back to [`main`](#main-and-default-branch) before [merging](#merge) and it disappears
from the folder; switch back to `add-question` and it returns.

### Main and default branch

`main` is the name we use for the team's agreed version. The default branch
is the one [GitHub](#github) shows first when someone opens the [repository](#repository-or-repo). It is often
called `main`; some projects use `master` or another name.

### Checkout or switch

Select the [branch](#branch) or [commit](#commit) you want to work with. For our exercise, "check
out the branch" means choose it under Current Branch in [Desktop](#github-desktop).

### HEAD

[Git](#git)'s marker for the position you are currently working from. Normally it
points to your current [branch](#branch). A "detached HEAD" means you have selected a
particular [commit](#commit) directly, without being on a branch.
GitHub's [head repository](#head-repository) and [head branch](#compare-branch-or-head-branch)
labels instead describe where a pull request's proposed changes come from.

### Publish branch

Put a local [branch](#branch) on [GitHub](#github) for the first time. It makes the branch available
for [review](#review-approve-and-request-changes). It does not [merge](#merge) the branch into [`main`](#main-and-default-branch).

### Pull request, or PR

A proposal to [merge](#merge) changes from one [branch](#branch) into another, with a place to
[review](#review-approve-and-request-changes) the [diff](#diff) and discuss it. Opening a PR leaves the destination branch
unchanged. The word "[pull](#pull)" here is confusing: creating a PR does not download
anything to your computer.

### Base repository

The destination [repository](#repository-or-repo) in a [pull request](#pull-request-or-pr):
the project you want to change. It contains the [base branch](#base-branch).
For a PR proposing Tom's changes back to D-Lab, this is
`dlab-berkeley/Git-Playground`. It appears on the left of GitHub's comparison bar.

### Base branch

The destination [branch](#branch), inside the [base repository](#base-repository).
It receives the proposed changes if the [PR](#pull-request-or-pr) is
[merged](#merge). GitHub labels this selector **base**. In our exercises, select
[`main`](#main-and-default-branch). Opening the PR leaves this branch unchanged.

### Head repository

The source [repository](#repository-or-repo) in a [pull request](#pull-request-or-pr):
the project containing the changes you are proposing. It contains the
[compare branch](#compare-branch-or-head-branch) and appears on the right of
GitHub's comparison bar. When Tom proposes changes from his [fork](#fork) back
to D-Lab, it is `tomvannuenen/Git-Playground`.

For the solo practice PR and the team project PRs, the head repository and
[base repository](#base-repository) are the same repository; the two branches
differ. In the fork exercise, your fork is the head repository and the teaching
repository is the base. These labels describe the source and destination for
this PR, not your computer versus GitHub.

### Compare branch or head branch

The source [branch](#branch), inside the [head repository](#head-repository).
It contains the changes you want to bring into the [base branch](#base-branch).
[GitHub](#github) labels this selector **compare**; its documentation also calls
it the **head branch**. In the solo practice exercise, select `add-question`.
For the teaching-repository contribution, select `clarify-instructions` in
your fork. For the team planning note, select your `plan-USERNAME` branch.

For a [PR](#pull-request-or-pr) from a [fork](#fork), both base and compare can be
called `main`: they are branches in different repositories. Always check the
repository names too. The direction is **compare → base**. The head branch label
is different from [Git](#git)'s uppercase [`HEAD`](#head) marker.

### Draft pull request

A [PR](#pull-request-or-pr) opened while work is still in progress. People can discuss it, but it
must be marked ready before it can be [merged](#merge). See the
[pull request quickstart](https://docs.github.com/en/pull-requests/get-started/pull-request-quickstart)
for the [base](#base-branch), [compare](#compare-branch-or-head-branch), and draft choices.

### Files changed

The [PR](#pull-request-or-pr) tab showing the proposed [diff](#diff). This is where a [reviewer](#review-approve-and-request-changes) checks which
files and lines would change, and can leave comments on specific lines.

### Review, approve, and request changes

Review means reading the proposed changes and giving feedback. Approve records
that the reviewer is satisfied; request changes asks for revisions. Neither
button [merges](#merge) the [PR](#pull-request-or-pr). "Can be merged" tells you [Git](#git) can combine the files,
not that the proposed change makes sense. [Review reference](https://docs.github.com/en/pull-requests/reference/pull-request-reviews).

### Merge

Bring the work from one [branch](#branch) into another. Merging `plan-maya` into [`main`](#main-and-default-branch)
updates `main`; the source branch can still exist afterwards. If the merge
happens on [GitHub](#github), your local `main` still needs to [pull](#pull) the result.

### Merge commit

A [commit](#commit) that joins two histories. [Git](#git) may create one during a [merge](#merge); some
merges can simply move the destination [branch](#branch) forward without an extra commit.
That simpler case is called a fast-forward.

### Protected branch or ruleset

[Repository](#repository-or-repo) rules that restrict changes, such as requiring a [review](#review-approve-and-request-changes) or passing
[checks](#github-actions-workflow-and-checks) before a [PR](#pull-request-or-pr) can [merge](#merge). A merge button can be unavailable because a rule
hasn't been satisfied, even when the files have no [conflicts](#merge-conflict).

## Conflicts and unfinished work

### Merge conflict

[Git](#git) cannot combine some changes automatically. Suppose Maya changes a line
to "Next step: check the source" while Luis changes it to "Next step: refine
the question". Someone needs to decide what the final line should say.

### Conflict markers

Lines such as `<<<<<<<`, `=======`, and `>>>>>>>` around competing versions
in a [conflicted](#merge-conflict) text file. [Resolve](#resolve-a-conflict) the content and remove the markers before
completing the [merge](#merge).

### Resolve a conflict

Decide on the intended final content, edit the file accordingly, and complete
the [merge](#merge). The answer can include work from both versions. A warning going
away doesn't prove you kept the right content.

### Stash

Temporarily set aside [saved](#save), [uncommitted changes](#uncommitted-changes) so you can do something else,
such as [pull](#pull). The stash stays on your computer and isn't [pushed](#push) to [GitHub](#github).
[Restoring](#restore-a-stash) it can still cause a [conflict](#merge-conflict).

### Restore a stash

Put the set-aside edits back into your [working files](#working-directory-working-tree-or-working-copy). In [Desktop](#github-desktop), use [Stashed
Changes](#stash) → Restore on the [branch](#branch) where you left them. The restored edits still
need a [commit](#commit) when you are ready to keep them in [history](#history).

### Discard changes

Remove [uncommitted edits](#uncommitted-changes) instead of keeping them. Discarding doesn't first
save those edits as a [commit](#commit). Check exactly what is selected before using it.

### Revert a commit

Make a new [commit](#commit) that reverses an earlier commit's changes. The original
commit remains in [history](#history), so people can see both the change and its reversal.
[Desktop's revert reference](https://docs.github.com/en/desktop/managing-commits/reverting-a-commit-in-github-desktop).

## People and permissions

### Username, profile, and avatar

Your username identifies your [GitHub](#github) account. Your profile is the page showing
information about you and your work; your avatar is the picture that opens
the account menu. Invite teammates by username so you find the right account.

### Owner, organization, and collaborator

The owner is the account or organization that owns a [repository](#repository-or-repo). An organization
is a shared account for a group, such as `macss-berkeley`. A collaborator has
been given access to work on a repository; the permissions determine what
they can do.

### Public and private

Anyone can read a public [repository](#repository-or-repo). A private repository is restricted to
people with access. Public visibility doesn't let every reader [push](#push) changes
or [merge](#merge) [PRs](#pull-request-or-pr) into it.

### Read and write access

Read access lets someone view the [repository](#repository-or-repo). Write access normally lets them
[push](#push) [branches](#branch) and [merge](#merge) [PRs](#pull-request-or-pr), subject to the repository's rules. A teammate
must accept an invitation before the granted access takes effect.

### Account settings and repository settings

Account settings affect your account, such as your [profile](#username-profile-and-avatar) and [authentication](#authentication-https-and-ssh-key).
Repository settings affect one project, such as who can contribute and how
its website is published.

### Issue

A discussion about a task, bug, or question. An issue can describe work that
needs doing; a [PR](#pull-request-or-pr) contains a proposed file change. You can link the two.

### Mention, assignee, and label

`@username` mentions a person and can notify them. An assignee is the person
listed as responsible for an [issue](#issue) or [PR](#pull-request-or-pr). Labels help organise items, for
example `bug` or `documentation`.

## Project files and websites

### README and Markdown

A README explains the project to someone opening the [repository](#repository-or-repo). Markdown is
the plain-text formatting used in `README.md`: `#` makes a heading, for
example. [GitHub](#github) displays a formatted version while [Git](#git) tracks the text file.

### .gitignore and ignored files

`.gitignore` contains patterns for files [Git](#git) should leave out when looking for
new files to add. An ignored file can remain on your computer. Adding its name
to `.gitignore` won't remove an already [tracked file](#tracked-and-untracked-files) or erase earlier [commits](#commit).

### GitHub Pages

[GitHub](#github)'s service for publishing a website from [repository](#repository-or-repo) files. Publishing a
repository and publishing its website are separate actions. Our later Pages
exercise uses the files in `docs/` on [`main`](#main-and-default-branch).

### Build and deployment

A build prepares files for use, for example turning [Markdown](#readme-and-markdown) into website
pages. Deployment puts the prepared site online. A [commit](#commit) can already be on
[GitHub](#github) while its website build is still running or has failed.

### GitHub Actions, workflow, and checks

Actions runs automated jobs, such as tests or website [builds](#build-and-deployment). A workflow is
the recipe for when those jobs run and what they do. Checks report results
on [commits](#commit) or [PRs](#pull-request-or-pr). A passing check only tells you that the particular job
passed; it doesn't verify every research claim in the project.

### Authentication, HTTPS, and SSH key

Authentication proves which account you are using. HTTPS is the connection
method [GitHub Desktop](#github-desktop) uses. SSH is another method, often used with terminal
[Git](#git): you give [GitHub](#github) a public key and keep the matching private key on your
computer. Our Desktop exercise needs no SSH setup.

### Personal access token, or PAT

A credential some tools use to access [GitHub](#github) as your account, with specified
permissions. Treat it like a password. You don't need to create one manually
for the [Desktop](#github-desktop) sign-in used in class.

## Other terms you may see in menus

These are for lookup if you encounter them. The Week 3 exercise doesn't
require changing existing commit history.

### Undo and reset to commit

In [Desktop](#github-desktop), Undo removes the most recent unpushed [commit](#commit) and returns its edits
to [Changes](#changes). Reset to commit can do that for several later commits, keeping
their changes [uncommitted](#uncommitted-changes). Command-line reset has additional modes that can
remove edits, so the exact action matters.
[Desktop's reset reference](https://docs.github.com/en/desktop/managing-commits/resetting-to-a-commit-in-github-desktop).

### Amend

Replace the most recent [commit](#commit) with a corrected version, perhaps to fix its
message or include a forgotten edit. The replacement has a different [commit ID](#commit-id-hash-or-sha).

### Squash

Combine several [commits](#commit) into one. On a [PR](#pull-request-or-pr), Squash and merge records the
[branch](#branch)'s combined changes as one new commit on the [base branch](#base-branch).

### Cherry-pick

Apply the change from a particular [commit](#commit) to another [branch](#branch), usually making
a new commit there. This lets you bring over one change without [merging](#merge) the
whole branch. [Desktop's commit-management reference](https://docs.github.com/en/desktop/managing-commits/options-for-managing-commits-in-github-desktop).

### Rebase

Replay a [branch](#branch)'s [commits](#commit) from a different starting commit. This produces
new [commit IDs](#commit-id-hash-or-sha) and may require [resolving](#resolve-a-conflict) [conflicts](#merge-conflict) along the way. We use
[merging](#merge) in the class exercise.

### Force push

Update a [remote](#remote-repository) [branch](#branch) even when the change replaces its existing line of
[history](#history). This can displace [commits](#commit) that teammates are using; it isn't the
normal fix for a refused [push](#push).

### Tag and release

A tag gives a particular [commit](#commit) a name, such as `v1.0`. A [GitHub](#github) release is a
page associated with a tag, often with notes and downloadable files. Neither
is required to make ordinary commits or share a [repository](#repository-or-repo).
