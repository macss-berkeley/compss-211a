# Set up and use the final project repository

## What you will practice

This lab sets up the one repository your team will use for the final project.
You will:

- confirm that everyone can access the same repository;
- create the shared Python environment;
- decide what belongs in a notebook and what belongs in a script;
- make one small contribution on a branch;
- review and merge a teammate's pull request.

The repository begins with the files in the
[final project template](../../final-project-repo/README.md). You do not need to
understand every file before starting.

## 1. Create one repository for the team

Follow the repository-creation link or instructions provided by the instructor.
One teammate coordinates this step:

1. Create exactly one repository from the course template.
2. Use the naming convention announced in class: lowercase words separated by
   dashes, such as `team-2-brand-performance`.
3. Give every teammate collaborator access.
4. Share the one canonical repository URL with the team.

Everyone else should open that URL and accept the invitation. Do not create
another copy if the repository does not appear. First check the invitation,
repository URL, and signed-in GitHub account.

## 2. Understand the starter files

The template is intentionally small:

```text
your-project-repo/
├── README.md
├── notebooks/
├── scripts/
├── data/
├── pyproject.toml
└── uv.lock
```

- `README.md` explains the question, team, run order, and eventual findings.
- `notebooks/` is the normal starting place for exploration and analysis.
- `scripts/` holds stable tasks that should run the same way each time.
- `data/` holds permitted small files or instructions for obtaining data.
- `pyproject.toml` lists the supported Python version and packages.
- `uv.lock` records the exact package versions used by the team.

There is no `src/` package in this course template. Building a Python package
would add machinery that most projects do not need.

## 3. Clone the repository and create the environment

Every teammate should:

1. open GitHub Desktop;
2. select **File -> Clone Repository**;
3. choose the **GitHub.com** tab and select the team repository;
4. choose a local location they can find again;
5. select **Clone**;
6. open the complete repository folder in VS Code;
7. open a terminal in that folder and run:

   ```bash
   uv sync --frozen
   ```

8. select the repository's `.venv` as the Python interpreter and notebook
   kernel in VS Code.

Do not continue until everyone can clone the same repository and select its
environment.

## 4. Notebook or script?

Both notebooks and scripts contain ordinary Python code. The difference is how
the team uses them.

Start in a **notebook** when you are exploring, learning what the data contain,
trying a method, looking at output, or explaining an analysis step by step.

Use a **script** when a task is understood and should run the same way more
than once, such as downloading data, preparing the final analysis file, or
recreating final figures.

Use this rule:

> Explore and explain in a notebook. Automate a stable repeated task in a
> script.

Discuss where each task belongs:

1. Inspect ten documents and write observations beside the output.
2. Download the same bounded API records again.
3. Try two possible cleaning rules and compare what they remove.
4. Rebuild the final cleaned file from the raw data.
5. Explain a result using prose, a table, and a plot.

A script is not automatically better than a notebook. If the team cannot
explain a script, simplify it before relying on it.

### Run one simple script

Create `scripts/check_setup.py` with these two lines:

```python
import sys
print("Python:", sys.version.split()[0])
```

Run it from the repository folder:

```bash
uv run python scripts/check_setup.py
```

Now run equivalent code in a notebook cell. The Python code works in both
places. The script runs from beginning to end as a file; the notebook lets you
run and discuss individual cells. Keep `check_setup.py` as a simple example
or replace it later with a project-relevant script.

## 5. Agree on the team workflow

Record these decisions in the README:

- Use one short-lived branch per task.
- Pull the latest `main` before creating a branch.
- Use task names such as `document-data-source` or `add-first-figure`.
- Open a pull request for review before merging.
- Assign one active editor to a notebook at a time.
- Never commit credentials, `.env` files, restricted data, or accidental
  large files.
- Name the person responsible for the next concrete update.

## 6. Make the first project contributions

Give each teammate a different small artifact so nobody edits the same lines.
Possible contributions are:

- complete the project overview near the top of `README.md`;
- add `data/README.md` with the candidate source, access method, coverage, and
  sharing limits;
- create `notebooks/01_project_questions.ipynb` with the tentative question,
  unit of analysis, and a few Markdown notes;
- add and run `scripts/check_setup.py`;
- add safe project-specific entries to `.gitignore` after checking what they
  exclude.

For each contribution:

1. Switch to `main`, fetch, and pull.
2. Select **Current Branch -> New Branch** in GitHub Desktop.
3. Name the branch after the task.
4. Make one focused change.
5. Inspect the diff and commit with a message that explains the result.
6. Publish the branch and open a pull request.
7. Confirm that the base is `main` and only the intended files changed.
8. Describe what changed and what the reviewer should check.
9. Review someone else's pull request in **Files changed**.
10. Ask a question or request a specific improvement when something is unclear.
11. Let another teammate merge the pull request.

Do not merge your own pull request during this exercise. Reviewing is part of
the work.

## 7. Pull the merged work

After a pull request is merged:

1. switch to `main`;
2. select **Fetch origin**, then pull;
3. confirm that the contribution appears locally;
4. delete the finished branch only after its commits are merged.

If `main` changes while your branch is open, update your branch from `main`
and inspect the result before continuing.

## 8. Avoid notebook conflict traps

Notebook files contain code, prose, outputs, and metadata. Two people editing
the same notebook can produce a conflict that is hard to interpret.

Before editing a notebook:

1. check the team's task list and open pull requests;
2. announce that you are taking that notebook;
3. pull `main`, create a branch, and keep the change focused;
4. restart and run the notebook from top to bottom before review;
5. merge promptly and tell the team when the notebook is available again.

If a notebook conflict occurs, coordinate with the other author, decide which
cells belong in the final version, rerun it, and review the rendered notebook.
Do not choose an entire version merely because Git labels it yours or theirs.

## Before you leave

Confirm that:

- every member can open and clone the same canonical repository;
- every member can use the repository's `.venv` environment;
- the README names the team, tentative question, and next responsibility;
- the team recorded its branch, review, notebook-ownership, and data-safety
  agreements;
- each member authored a focused commit on a branch;
- each member opened or reviewed a pull request;
- the team can explain why its current work belongs in a notebook or script;
- no credentials, private data, or accidental large files were committed.
