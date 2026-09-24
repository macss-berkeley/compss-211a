# Team project: collaborate in one repository

Continue here after [Git and GitHub basics](1_github_basics.md). Keep the
[glossary](3_git_github_glossary.md) handy for unfamiliar terms.

Each person needs GitHub Desktop, VS Code, and their own GitHub account.
By the end, everyone should have proposed a change, reviewed a teammate's
change, and opened the merged work locally.

Today we edit Markdown files. **Don't worry about scripts or command-line
setup yet; we'll cover those next week.** The template README describes the
whole project, including later Python setup. Follow this guide for today's
exercise; no terminal commands or new Python environment are needed.

**Timing for a 30-minute session:** about 10 minutes for section 1, 15 for
section 2 with everyone authoring at the same time, and section 3 if time
remains.

## 1. Create one shared repository and clone it

### One teammate creates the repository

Choose one person to own the team's repository. If you already have a shared
project repository, use it and continue with the invitations below.

Note: A **template repository** is a starter repository on GitHub that anyone can copy into a brand-new repository of their own, getting its files and folder structure but none of its commit history or connection to the original. We have created a template repository for your final projects.

1. The owner opens the [project template](https://github.com/macss-berkeley/compss-211a-project-template)
   and chooses **Use this template → Create a new repository**
2. Under **Owner**, choose that person's account. Enter a team-specific name,
   such as `team-2-project`, and select **Public**. Leave **Include all branches**
   off, then select **Create repository**.
   [Example creation form](../../img/team-template-form.png).
3. Copy the new repository's address from the browser and share it with your
   teammates. It should look like `https://github.com/OWNER/team-2-project`.
   Everyone will work in this one repository.

### The owner invites everyone

1. In the new repository on GitHub, the owner opens **Settings → Collaborators →
   Add people** and invites each teammate by their GitHub username.
   [Example invitation dialog](../../img/github-add-people.png).
2. Each teammate opens the invitation in their email or GitHub notifications
   and accepts it while signed in to their own account. If the email has not
   arrived, open `https://github.com/OWNER/REPOSITORY/invitations` while signed in.
3. The owner checks that everyone has accepted. An invitation still marked
   pending has not yet given that teammate access to contribute.

Making a repository public lets other people read it. Accepting the
collaborator invitation also lets your teammates publish branches and merge
PRs. **They do not need separate forks for this exercise.**

### Everyone, including the owner, clones it

1. In GitHub Desktop, choose **File → Clone Repository → URL**. Paste the shared
   repository's URL, choose a local folder outside your course and practice
   repositories, and select **Clone**. If you already cloned this team
   repository, select that existing copy instead.
2. Check **Current Repository** at the top of GitHub Desktop: it should show the
   team's repository. **Current Branch** should be `main`.
3. Select **Repository → Open in Visual Studio Code**. If that option is not
   available, use VS Code's **File → Open Folder** and choose the cloned folder.
4. In VS Code's Explorer, open `README.md`. This should be the project template's
   README, with prompts for your question, team members, and data source.
5. In GitHub Desktop, use **Repository → View on GitHub**. Compare the address with
   your teammates: everyone should reach the same `OWNER/REPOSITORY`.

**Check before continuing:** everyone can open the team's README on their
computer and the same shared repository on GitHub.

A **template** creates a new repository from starter files. **Cloning** brings
an existing repository's files and history onto your computer and connects it
to the GitHub copy. Each teammate has a separate local copy of the same project.

## 2. Review and merge a teammate's pull request

Everyone writes a planning note at the same time and reviews one teammate's
note. Decide the order before starting: A reviews B, B reviews C, and the last
person reviews A. In a pair, review each other's work.
The **author** proposes the change; the **reviewer** reads it and gives feedback.

Preview: [tab 4 of How Git Thinks](https://macss-berkeley.github.io/compss-211a/interactives/week03-how-git-thinks.html#branches).

### Author: create a branch

1. In GitHub Desktop, check that **Current Repository** is your team's repository.
   Open **Changes**. If it lists unfinished edits, finish or get help preserving
   them before switching branches.
2. Select **Current Branch → main**, then **Fetch origin** and **Pull origin**
   if offered. This brings your local starting point up to date.
3. Select **Current Branch → New Branch**. Enter `plan-USERNAME`, replacing
   `USERNAME` with your GitHub username; for example, `plan-alex`.
4. If GitHub Desktop asks which branch to start from, choose `main`. Select
   **Create Branch**. Check that **Current Branch** now shows your new name.

### Author: write and save a planning note

1. Open the team's folder in VS Code. Choose **File → New Text File**.
2. Add the text below and replace the prompts with your ideas. A tentative
   proposal is fine.

   ```markdown
   # Project plan

   Question: What might we investigate?
   Possible source: Where might the data come from?
   Next step: What should we check first?
   ```

3. Save the file as `plan-USERNAME.md` in the same folder as `README.md`.
   This is the repository's **top level**: the outer folder, outside its
   `data/`, `notebooks/`, and other subfolders. For `plan-alex`, use
   `plan-alex.md`. Each person uses their own filename.
4. Return to GitHub Desktop. Under **Changes**, select your new file and read the
   diff. Check that it contains the note you intended to write.

**Check:** your file is listed under Changes, and Current Branch still shows
`plan-USERNAME`. If the file is missing, check that you saved it inside the
team repository rather than your course or practice folder.

### Author: commit and publish the branch

1. In **Changes**, leave only your planning file checked.
2. In **Summary**, write a message such as `Propose a question about transit`.
   Select **Commit to plan-USERNAME**. If the button names `main`, check which
   branch you are on before committing.
3. Select **Publish branch**. This sends the branch and its commit to GitHub.
   For later commits on this branch, the button will be **Push origin**.
4. Select **Repository → View on GitHub**. On the **Code** tab, use the branch
   dropdown to select `plan-USERNAME` and open your file.

**Check:** your planning note is visible on your branch on GitHub. Publishing
the branch has not added the note to `main`.

### Author: open the pull request

1. In the team's GitHub repository, select **Pull requests → New pull request**.
   Two shortcuts open the same form: the yellow **Compare & pull request**
   banner GitHub shows after a push, and **Preview Pull Request** in GitHub Desktop.
2. Set **base: `main`** and **compare: `plan-USERNAME`**. Base is the destination;
   compare is the branch containing your proposal. Both belong to the team's
   repository.
3. Read the diff below the selectors. It should show your planning file and
   the text you added. Select **Create pull request**.
4. Give it a descriptive title. In the description, say what you propose and
   what you would like your reviewer to consider. Select **Create pull request**
   to submit it.
5. Copy the PR's browser address and send it to your assigned reviewer. Keep
   this PR open while you discuss the change.

### Reviewer and author: discuss the proposal

1. **Reviewer:** open the PR link and select **Files changed**. Read the note.
   Is the question understandable? Is the next step feasible? Did only the
   intended file change?
2. Open **Conversation**, write feedback in the comment box, and select
   **Comment**. Suggest a specific improvement, or explain why the proposal
   is ready to merge.
3. **Author:** read the feedback and reply in the PR. If a revision is needed,
   check that GitHub Desktop still shows your `plan-USERNAME` branch. Edit the same
   file in VS Code, save it, inspect the diff in GitHub Desktop, commit, and select
   **Push origin**.
4. **Reviewer:** refresh the existing PR and read the revised diff. New commits
   on that branch update this PR; the author does not need to open another one.

### Reviewer: merge; everyone: pull

1. When the proposal is ready, the reviewer opens **Conversation**, selects
   **Merge pull request**, and confirms with **Confirm merge**. The PR should
   now be marked **Merged**. If merging is blocked, use
   [the troubleshooting section below](#if-something-gets-stuck).
2. On GitHub's **Code** tab, select `main` and check that the planning file
   appears there.
3. **Everyone:** in GitHub Desktop, check that **Changes** has no unfinished edits.
   Select **Current Branch → main**, then **Fetch origin** and **Pull origin**
   if offered.
4. Open the team's folder in VS Code and read a teammate's planning file.
   Everyone should now have authored one merged PR and reviewed one. After a
   PR is merged, its finished branch can be deleted.

**Check:** you can point to your merged PR, a PR where you left feedback, and
a teammate's planning file on your computer. Merging updates GitHub's `main`;
each person still needs to pull to update their local copy.

## 3. Agree on the next project work

Read each other's planning notes and agree on a tentative question, a possible
data source, and one small next task per person. You can revise these later.

1. Choose one teammate to update the README and another to review it. The
   author starts from updated `main` and creates a new branch, `agree-next-steps`,
   using the same steps as in [section 2](#2-review-and-merge-a-teammates-pull-request).
2. Open `README.md` in VS Code. Under **Project overview**, fill in the research
   question, team members, and data source. Mark anything undecided as tentative.
   Leave the later analysis and results prompts for when you have that work.
3. Add a `## Next steps` heading with one small task and a responsible person
   on each line. For now, tasks can be checking a source, defining a question
   more clearly, or documenting how to obtain the data.
4. Save, inspect the diff, commit, publish the branch, and open a PR into `main`.
   The reviewer checks that it reflects the team's agreement, then merges it.
5. Everyone returns to `main` in GitHub Desktop, fetches, and pulls. Open the local
   README and check that it contains the agreed question and responsibilities.

If the session ends before you finish, complete this README contribution and
any remaining planning-note reviews with your team before Monday.

## 4. Carry these habits into the project

- Start each task from updated `main` and create a new branch for that task.
  Keep changes small enough for someone else to review.
- Agree on **one active editor per notebook** when you begin Python work.
  Notebook files contain outputs and metadata as well as code, which can make
  their diffs and conflicts difficult to read. Finish review and merging,
  then have the next editor pull the shared version before starting.
- Check which files you are committing. Passwords, API keys, and `.env` files
  stay outside Git. Follow the source's rules for private or restricted data.
- `.gitignore` excludes matching **untracked** files. It does not untrack files
  already committed or erase old history. The template's ignore rules help,
  but you should still inspect the Changes list.

**You have finished this exercise when:**

- Everyone has a local copy of the shared repository.
- Everyone has authored a merged PR and reviewed someone else's contribution.
- Everyone can open a teammate's merged note locally.
- The README records the team's tentative question, source, and responsibilities.

## If something gets stuck

**You cannot publish a branch or merge a PR:** check that you accepted the
collaborator invitation, GitHub Desktop and your browser use the invited account,
and you are in the team's repository. Ask the owner to check your access.
If GitHub names a required review or check, read that message before continuing.

**You committed to `main` instead of your branch:** if you have not pushed,
open **Changes** in GitHub Desktop and select **Undo** beneath the commit box.
The commit comes back as unfinished changes. Create your branch, then commit
again.

**GitHub Desktop reports unfinished changes when you switch or pull:** keep your
work and inspect the Changes list. See the earlier
[stash exercise](1_github_basics.md#make-a-pull-fail-then-stash-and-resolve-a-conflict)
or ask for help before continuing.

**Your PR has a merge conflict:** Git cannot combine the changes automatically.
The author and reviewer should read both versions and agree what the final
file should contain. For a simple Markdown conflict, the author can select
**Resolve conflicts** on the PR, replace the conflict block with the agreed
text, and remove its `<<<<<<<`, `=======`, and `>>>>>>>` markers. Resolve every
block, select **Mark as resolved**, then **Commit merge**. This updates the
proposal branch; the reviewer still needs to recheck **Files changed** and
select **Merge pull request** to bring it into `main`.
[GitHub's conflict-resolution guide](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-on-github).

If **Resolve conflicts** is unavailable, or the conflict involves a notebook,
ask for help. Keep both people's work available while deciding what to retain.
You do not need to create a conflict to complete this exercise.

## Next week: command line and scripts

The template includes `notebooks/`, `scripts/`, and Python setup files such as
`pyproject.toml` and `uv.lock`. Leave them as supplied for now. You do not need
to choose between a notebook and a script, write a `.py` file, or run the
README's terminal setup commands to complete today's Markdown exercise.

We'll discuss scripts and command-line work in
[Week 4](../week04_reproducible-analyses/README.md), and return to setting up and running
Python in your team's repository then.

## Next week: publish a website with GitHub Pages

Publishing a repository makes its files available on GitHub. **GitHub Pages**
is a separate service that builds a website from a configured branch/folder
or workflow. A repository README and a published webpage are different views.

Preview: [tab 5 of How Git Thinks](https://macss-berkeley.github.io/compss-211a/interactives/week03-how-git-thinks.html#pages).

Since our template was already prepared to be published as a website from the `docs/` folder, 
we can do that now:

1. In **your team's repository**, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main`, folder `/docs`, then **Save**.
4. Wait for deployment, then use **Visit site** or the URL GitHub displays.
   Check your team's URL, not the template author's example URL. The first
   version is a plain grey-and-white page titled "[Project title]" with the
   headings and bracketed prompts from `docs/index.md`. That placeholder page
   means publishing worked.
5. If time remains, make the first real change. One teammate creates a branch,
   replaces `[Project title]` in `docs/index.md` with your working title,
   commits, publishes the branch, and opens a PR. The reviewer merges it. Wait
   for the site to rebuild, then check that the page shows the new title.