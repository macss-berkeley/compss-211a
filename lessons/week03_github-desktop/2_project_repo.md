# Set up the final project repository

## What you will practice

This activity sets up the repository your team will use for the final project. You will create or join the correct GitHub Classroom team, clone the shared repository, make a small contribution, and review a teammate's pull request.

## 1. Create or join the team

One person creates the team:

1. Open the GitHub Classroom invitation and accept the assignment.
2. Select **Create or join a team -> Create a new team**.
3. Use the naming convention announced in class: lowercase words separated by dashes, including the team number and project subject, such as `team-2-brand-performance`.
4. Wait for GitHub Classroom to create the private team repository from the template.

Everyone else joins that team:

1. Open the same invitation.
2. Select the team that your teammate created.
3. Confirm that you are joining the correct team.

Before continuing, open the repository and confirm that every member has access. If someone created a duplicate team, stop and tell the instructor rather than building work in two repositories.

## 2. Read the repository structure

The project template uses these folders:

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
2. select **File -> Clone repository**;
3. choose the **GitHub.com** tab and find the team repository;
4. choose a local location you can find again;
5. select **Clone**.

Do not continue until everyone can see the same repository. If it is missing, check the Classroom team membership and repository access before trying to clone another copy.

## 4. Practice one change at a time

Take turns for this first round. The point is to see the complete pull, edit, commit, push, and verification cycle without manufacturing a conflict.

For each team member:

1. Pull or fetch before starting.
2. In `scripts/`, create `hello_yourname.py`.
3. Add a short script such as:

```python
"""Introduce one project contributor."""

name = "Your Name"
planned_contribution = "data documentation"

print(f"Hello from {name}.")
print(f"I plan to work on {planned_contribution}.")
```

4. Inspect the file in GitHub Desktop.
5. Commit it with a message such as `Add Alice's contributor script`.
6. Push the commit.
7. Open GitHub.com and verify that the file is present.
8. Tell the next teammate to pull before starting.

Question: Why are you taking turns for this first exercise rather than editing simultaneously?

## 5. Use a branch and pull request

Now each team member makes a separate, reviewable change.

1. Pull the latest `main` branch.
2. Select **Current Branch -> New Branch** in GitHub Desktop.
3. Name it after the change, such as `alice-contribution-note`.
4. Add your name and planned responsibility to the README.
5. Inspect the diff and commit it on your branch.
6. Select **Publish branch**.
7. On GitHub, open a pull request from your branch into `main`.
8. Describe what changed and what the reviewer should check.
9. Review someone else's pull request in the **Files changed** tab.
10. Ask a question or leave a useful comment before approving it.
11. Let another teammate merge your pull request.

Do not merge your own pull request during this exercise. The review is part of the work, not a formality.

## 6. Update and remove branches

If `main` changes while your branch is open, switch to your branch in GitHub Desktop and select **Branch -> Update from main**. Inspect the result before continuing.

After a pull request is merged, confirm that the commits appear on `main`. You may then delete the finished branch through **Branch -> Delete**. Keeping a branch forever does not preserve extra work once its commits are safely merged.

## Before you leave

Confirm that:

- every member can open and clone the repository;
- the README names the team and tentative project responsibility of each member;
- each member has authored at least one commit;
- each member has opened or reviewed a pull request;
- no credentials, private data, or accidental large files have been committed;
- the team knows who will make the next project update.
