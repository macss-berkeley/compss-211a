# Set up the final project repository

## What you will practice

This activity sets up the repository your team will use for the final project. You will confirm that everyone can access the same repository, agree on a collaboration workflow, make a small project-relevant contribution, and review a teammate's pull request.

## 1. Open or create one team repository

Follow the repository-creation and access process announced by the instructor.

One person coordinates the initial repository:

1. Create or open exactly one repository for the team using the location and visibility announced in class.
2. Use the naming convention announced in class: lowercase words separated by dashes, including the team number and project subject, such as `team-2-brand-performance`.
3. If the repository is owned by a team member, organization, or course account, give every teammate the required collaborator access.
4. Share the canonical repository URL with the entire team.

Everyone else should open that exact URL, accept any collaborator invitation, and confirm that they can see the repository. If the creation process or repository location has not yet been announced, stop and ask the instructor rather than creating an unofficial repository. If the team accidentally creates duplicates, choose one canonical repository before doing project work.

## 2. Read the repository structure

A recommended project structure is:

```text
your-project-repo/
├── README.md
├── src/
├── scripts/
├── notebooks/
└── data/
```

- `README.md` tells a new reader what the project does and how to run it.
- `src/` holds functions, classes, and modules reused across the project.
- `scripts/` holds programs that perform a defined task from start to finish.
- `notebooks/` holds exploratory analysis and explanations that benefit from code, output, and prose in one place.
- `data/` holds small permitted datasets or instructions for obtaining data that should not be committed.

Do not commit credentials, restricted data, or large files just because a folder is named `data`. Follow the course's data and repository policy.

Question: Which work belongs in a reusable script, and which work is easier to understand in a notebook?

## 3. Clone the shared repository

Every team member should:

1. open GitHub Desktop;
2. select **File -> Clone Repository**;
3. choose the **GitHub.com** tab and find the team repository;
4. choose a local location they can find again;
5. select **Clone**.

Do not continue until everyone can see and clone the same repository. If it is missing, check the collaborator invitation, repository URL, and signed-in GitHub account before creating another copy.

## 4. Agree on the team workflow

Record these decisions in the README or a short team-workflow file:

- Use one short-lived branch per task; do not do substantive work directly on `main`.
- Pull the latest `main` before creating a branch.
- Use descriptive branch names such as `maya-data-provenance` or `fix-api-pagination`.
- Open a pull request for review before merging.
- Assign one active editor to a notebook at a time. Notebook conflicts are difficult to resolve safely.
- Never commit credentials, `.env` files, restricted data, caches, or accidental large files.
- Name the teammate responsible for the next concrete update.

Question: Which of these agreements prevents problems, and which makes recovery easier after a problem occurs?

## 5. Make a project-relevant branch and pull request

Assign each teammate a different small setup artifact so the first changes do not compete for the same lines. Useful choices include:

- state the tentative research question and unit of analysis in `README.md`;
- add `data/README.md` with the candidate source, access method, coverage, and sharing limits;
- document the intended run order and expected outputs in `scripts/README.md`;
- add safe project-specific entries to `.gitignore` after reviewing what they exclude.

For each contribution:

1. Pull the latest `main` branch.
2. Select **Current Branch -> New Branch** in GitHub Desktop.
3. Name the branch after the task, not merely the person.
4. Make one focused change and avoid unrelated formatting edits.
5. Inspect the diff and commit it on the branch with a message that explains the result.
6. Select **Publish branch**, then **Preview Pull Request**.
7. Confirm that the base is `main` and only the intended files changed.
8. Create the pull request and describe what changed, why it belongs in the project, and what the reviewer should verify.
9. Review someone else's pull request in the **Files changed** tab. Check the content, paths, data/credential safety, and whether the change makes the project easier to reproduce.
10. Ask a question or request a specific improvement before approving when something is unclear.
11. Let another teammate merge the pull request.

Do not merge your own pull request during this exercise. The review is part of the work, not a formality.

## 6. Update and remove branches

If `main` changes while your branch is open, switch to your branch in GitHub Desktop and update it from `main`. Inspect any automatic merge before continuing. If Git reports a conflict, use the controlled conflict workflow from the GitHub Desktop fundamentals lesson and ask the other editor what the final file should contain.

After a pull request is merged:

1. switch to `main`;
2. select **Fetch origin**, then pull the merged commit;
3. confirm that the contribution appears on `main`;
4. delete the finished branch only after its commits are safely merged.

## 7. Avoid notebook conflict traps

Git can compare notebook files, but `.ipynb` files are structured JSON containing code, prose, metadata, and sometimes outputs. Two people editing the same notebook can produce a conflict that is hard to interpret correctly.

Before editing a notebook:

1. check the team's task list and open pull requests;
2. announce that you are taking ownership of that notebook for the current task;
3. pull `main`, create a branch, and keep the change focused;
4. restart and run the notebook from top to bottom before requesting review;
5. merge promptly, then tell teammates that the notebook is available again.

If a notebook conflict occurs, do not select an entire version merely because it is labeled yours or theirs. Coordinate with the other author, decide which cells and outputs belong in the final notebook, rerun it, and review the rendered result before committing the resolution.

## Before you leave

Confirm that:

- every member can open and clone the same canonical repository;
- the README names the team, tentative question, and current responsibility of each member;
- the team recorded its branch, review, notebook-ownership, and data-safety agreements;
- each member authored at least one project-relevant commit on a branch;
- each member opened or reviewed a pull request;
- no credentials, private data, or accidental large files were committed;
- the team knows who will make the next project update.
