# Final project: [working title]

Use this repository for your COMPSS 211A team project. Replace the bracketed
prompts as your project develops. A reader should eventually be able to use
this page to understand your question, find your analysis, and reproduce your
main result.

## Project overview

- **Research question:** [What are you trying to learn?]
- **Team members:** [Names]
- **Unit of analysis:** [What does one row or document represent?]
- **Data source:** [Where do the data come from?]
- **Main result:** [Complete this after the analysis.]
- **Important limitation:** [Complete this as soon as you identify one.]

## Start here

One teammate creates the repository from the course template and invites the
other teammates. The team should have only one shared project repository.

Every teammate then:

1. accepts the GitHub invitation;
2. clones the repository with GitHub Desktop;
3. opens the complete repository folder in VS Code;
4. opens a terminal in that folder and runs:

   ```bash
   uv sync --frozen
   ```

5. selects the `.venv` environment as the Python interpreter and notebook
   kernel in VS Code.

Use `uv sync --frozen --all-groups` only if your project needs the larger NLP
packages used in the optional course materials. Ask the instructional team
before adding a package or changing the environment files.

## What goes where?

```text
.
├── README.md        project question, run order, and main findings
├── notebooks/       exploration, analysis, figures, and explanations
├── scripts/         repeated tasks that should run the same way each time
├── data/            permitted small data files or data-access instructions
├── pyproject.toml   readable Python and package requirements
└── uv.lock          exact versions used by the team
```

### Start in a notebook

For most of this project, a notebook is the right place to work. Use a
notebook when you are:

- exploring unfamiliar data;
- trying a method for the first time;
- inspecting tables, plots, or individual texts;
- combining code, results, and written interpretation;
- preparing an analysis that a reader should follow step by step.

Give notebooks numbered names so their order is visible, for example:

```text
notebooks/01_explore_data.ipynb
notebooks/02_prepare_text.ipynb
notebooks/03_analyze_text.ipynb
notebooks/04_make_figures.ipynb
```

Not every project needs four notebooks. Use only the files that make your work
easier to understand.

### Move a repeated task into a script

A script is an ordinary Python file ending in `.py`. Create one when a step is
settled and you need to run it the same way more than once. Good candidates
include downloading data, cleaning raw files, or producing final tables and
figures.

For example:

```text
scripts/download_data.py
scripts/prepare_data.py
scripts/make_final_figures.py
```

Run a script from the repository folder:

```bash
uv run python scripts/prepare_data.py
```

Do not turn code into a script merely because it looks more professional. A
short, readable notebook is better than a script nobody on the team
understands. When you do create a script, first make the code work in a
notebook, simplify it, and make sure another teammate can explain what it does.

## Suggested project workflow

A simple notebook-first workflow is:

1. explore the data in `notebooks/01_explore_data.ipynb`;
2. document the data source and sharing limits below;
3. test cleaning and analysis steps in small notebook cells;
4. move only stable, repeated tasks into `scripts/`;
5. restart each important notebook and run it from top to bottom;
6. record the final run order in this README.

### Current run order

Replace this example with your actual files:

1. `[data-access step or script]`
2. `[preparation notebook or script]`
3. `[analysis notebook]`
4. `[figure or table step]`

## Working together with GitHub

Do not do substantial project work directly on `main`. For each small task:

1. switch to `main` in GitHub Desktop and **Fetch origin**;
2. pull any new commits;
3. create a short branch named for the task, such as `document-data-source` or
   `add-first-figure`;
4. make one focused change;
5. inspect the changed files in GitHub Desktop;
6. commit with a message that describes the result;
7. publish the branch and open a pull request;
8. ask a teammate to review it;
9. merge only after the reviewer understands and approves the change;
10. switch back to `main` and pull the merged commit.

### Notebook rule

Only one person should edit a particular notebook at a time. Before editing:

- tell the team which notebook you are taking;
- pull the latest `main` and create a branch;
- keep the change focused and merge it promptly;
- restart the notebook and run all cells before requesting review;
- tell the team when the notebook is available again.

Notebook files contain code, prose, outputs, and metadata, so simultaneous
edits can produce conflicts that are hard to resolve safely. If a notebook
conflict occurs, work with the other author and rerun the final notebook. Do
not blindly choose “ours” or “theirs.”

## Team agreements

Complete this section during the repository-setup lab.

- **Who may merge pull requests?** [Decision]
- **Who currently owns each notebook?** [Decision]
- **Where will the team record tasks?** [Decision]
- **How will the team review code it did not write?** [Decision]
- **What is the next task, and who owns it?** [Decision]

## Data and privacy

- **Source and access method:** [URL, API, archive, or other source]
- **Coverage:** [Dates, filters, sample, and exclusions]
- **What may be committed:** [Small public files, derived files, or none]
- **What must stay outside GitHub:** [Restricted, identifying, or large files]
- **How a new reader can obtain or reconstruct the data:** [Instructions]

Never commit passwords, API keys, tokens, `.env` files, private data, or files
you do not have permission to share. The template ignores `data/raw/` and
`data/private/`, but a `.gitignore` rule is not a substitute for checking every
commit.

## Results and interpretation

Complete this section as the analysis develops.

- **Main finding:** [Result with the relevant unit, count, or metric]
- **Evidence:** [Notebook, figure, or table that supports it]
- **Validation:** [Check, baseline, comparison, or inspected examples]
- **Limitations:** [Where the evidence or method can fail]
- **Strongest claim supported:** [A bounded conclusion]
- **Claim not supported:** [A tempting conclusion the project cannot make]

## Project page later in the course

The instructional team may ask you to add a small project page in a `docs/`
folder. Treat that page as a clear summary of the evidence already in the
repository, not as a separate web-development project. Publish only material
that is safe to make public.

## Before submitting

- [ ] Every teammate can clone and open the repository.
- [ ] `uv sync --frozen` creates the supported environment.
- [ ] The README gives the actual run order.
- [ ] Important notebooks run from top to bottom in a fresh kernel.
- [ ] Scripts can be run from the repository folder with their documented
      command.
- [ ] Figures and reported values match the final report.
- [ ] The data source, exclusions, and sharing limits are documented.
- [ ] No credentials, restricted data, or accidental large files are present.
- [ ] The final contribution of each team member is recorded.
