# GitHub Desktop fundamentals

## What you will practice

By the end of this lesson, you should be able to:

1. explain the difference between Git and GitHub;
2. distinguish a local repository from its remote copy;
3. make, commit, push, and pull a change in GitHub Desktop;
4. use a branch and pull request for collaborative work;
5. recognize a merge conflict and inspect it before choosing a resolution.

## Why use version control?

Suppose two people edit the same file, or you overwrite code that worked yesterday. A folder full of names such as `analysis_final_v2_really-final.ipynb` will not tell you what changed or why.

Git records snapshots of a project's files. Each snapshot, or commit, has a message and a place in the project's history. You can inspect earlier versions, compare changes, and return to a known state without keeping a pile of duplicate folders.

Google Docs has a version history for one document. Git applies the same basic idea to a project containing code, data instructions, documentation, and other text files.

## Git and GitHub are different

Git is the version-control software. GitHub hosts remote Git repositories and adds a web interface for collaboration, review, and publishing.

A **repository** is the project folder Git tracks. It contains the current files plus the history stored in its hidden `.git` directory.

- The **local repository** is on your computer.
- The **remote repository** is hosted elsewhere, usually on GitHub in this course.

The two copies do not synchronize automatically:

1. **Commit** records selected local changes with a message.
2. **Push** sends local commits to GitHub.
3. **Pull** brings remote commits to your local repository.

<img src="../../img/workflow.png" alt="Local commits are pushed to GitHub, and remote commits are pulled back to the local repository." width="55%">

## Personal workflow

When you are the only person working in a repository, you will often commit directly to the `main` branch. The basic loop is:

1. inspect the changed files;
2. write a short commit message that explains the change;
3. commit locally;
4. push the commit;
5. check GitHub to confirm that it arrived.

### Create a repository

You can start in either place:

- **GitHub.com:** create a repository and select **Add a README file**. This creates the remote repository. Clone it in GitHub Desktop to create the local copy.
- **GitHub Desktop:** select **Current Repository -> Add -> Create New Repository** and initialize it with a README. This creates the local repository. Select **Publish repository** to create the remote copy.

### Practice the loop

1. Create a repository under your account.
2. Add a file named `text.txt` with one or two lines of text.
3. Open GitHub Desktop and inspect the change.
4. Commit it with a message that says what you added.
5. Push the commit.
6. Open the repository on GitHub and find the file.

Question: At which step did the change become part of local history? At which step did it reach GitHub?

## Collaborative workflow

When several people share a repository, use branches to keep unfinished work away from `main`.

A **branch** is another line of development inside the same repository. A **fork** is a separate copy of someone else's repository under another GitHub account. Team members with access to the same repository usually use branches. Outside contributors often use forks.

<img src="../../img/collaborative.png" alt="Contributors develop changes separately and merge reviewed work into the main branch." width="55%">

### Fork and clone the practice repository

1. Fork [D-Lab's Git Playground](https://github.com/dlab-berkeley/Git-Playground) to your account.
2. In GitHub Desktop, select **Current Repository -> Add -> Clone Repository**.
3. Select your fork and choose where to store it locally.
4. If GitHub Desktop asks how you plan to use the fork, select **To contribute to the parent project**.

### Make a branch and pull request

1. Select **Current Branch -> New Branch** and choose a descriptive name.
2. Create a small text file or edit the README.
3. Inspect the diff and commit the change on your branch.
4. Select **Publish branch**.
5. On GitHub, select **Compare & pull request**. If the banner is absent, open **Pull requests -> New pull request**.
6. Confirm that the base branch is `main` and the compare branch is yours.
7. Write a title and a short description, then open the pull request.
8. Ask a teammate to inspect the **Files changed** tab before merging.

A pull request is a review conversation around a proposed merge. It does not automatically make the code correct.

## Merge conflicts

A conflict occurs when Git cannot combine changes automatically, often because two branches edited the same lines. Stop and read both versions before resolving it. Decide what the final file should say, remove the conflict markers, test or preview the result, and then commit the resolution.

Question: If Git reports a conflict, what information would you inspect before choosing either version?

## Removing repositories and branches

These actions discard information, so verify the target first.

- Removing a repository from GitHub Desktop does not necessarily delete its local folder.
- Deleting the hidden `.git` directory removes local Git history but leaves the visible project files.
- Deleting the entire project folder removes both files and local history.
- Deleting a remote repository happens under **Settings -> Danger Zone** on GitHub and cannot be undone through the normal interface.
- A merged branch can usually be deleted after confirming that its commits are on `main`.

## What to remember

- A commit records local history; a push transfers commits to a remote.
- Inspect changes before committing or resolving a conflict.
- Pull before starting shared work, especially when teammates may have pushed changes.
- Use a branch and pull request when the change needs review before it reaches `main`.
