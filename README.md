# COMPSS 211A

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

This repository contains the materials for COMPSS 211A: Computing I. The course is for master's students in computational social science, and it is built around the work you will actually need to do: manage files, write and debug Python, collect data, analyze text, collaborate through Git, and explain what your results do and do not show.

During the semester, you will:

- use Python and Pandas to work with tabular data;
- use Git, GitHub, and the command line to keep projects organized and reviewable;
- compare CSV, TSV, JSON, and XML data, then collect records through web APIs;
- clean and represent text with counts, TF-IDF, and lightweight document embeddings;
- test AI-generated code and evaluate LLM output against simpler methods;
- move selected workflows between local Jupyter, Google Colab, and cloud APIs.

Some exercises use public snapshots; others use synthetic data written for class. Either way, a result is only as good as its source, checks, and interpretation. You are expected to understand submitted code, document AI assistance, keep credentials out of notebooks, and remain accountable for every claim.

The course ends with a team project based on a text dataset. Your team will pose a social-science question, build a reproducible analysis, inspect errors and limitations, and present the result through code, a report, and a short talk.

## Local setup

The course uses `uv` to install the tested Python version and packages in a project-specific environment:

```bash
git clone https://github.com/macss-berkeley/compss-211a.git
cd compss-211a
uv sync --frozen
uv run jupyter lab
```

Install `uv` first and follow the operating-system instructions in [SETUP.md](SETUP.md). You do not need Conda or a separately registered `compss211` kernel. Start Jupyter through `uv run` whenever you work locally.

## Course data

The local fixtures required by homework and lab notebooks are committed under
[`data/`](data/). Their sources, synthetic-data labels, and interpretation
limits are documented in [`data/README.md`](data/README.md).

## Google Colab

Colab runs notebooks in a browser. Homework and lab notebooks that use tracked
fixtures must be run with the complete course repository or student package,
not as a standalone notebook: upload and extract the package under `/content`,
open the notebook from that copy, and then run its setup cell. The setup cell
locates the repository-level `data/` directory automatically.

Use Colab's default **latest runtime**. If a notebook needs a package that Colab does not supply, its instructions will provide the install command.

Lesson notebooks with an explicit raw-GitHub data fallback can instead be
opened directly from GitHub:

1. Go to [Google Colab](https://colab.research.google.com/).
2. Select **File -> Open notebook**, then choose the **GitHub** tab.
3. Enter this repository's URL and select the notebook.
4. Select **File -> Save a copy in Drive** before making changes. The repository copy is read-only, and the Colab runtime is temporary.

Most required notebooks use packages already present in Colab. If a notebook uses web-text or PDF extraction, install the small Colab supplement in its first cell:

```python
%pip install -q -r https://raw.githubusercontent.com/macss-berkeley/compss-211a/main/requirements-colab.txt
```

Before submitting an assignment, restart the runtime, run every cell from top to bottom, save the notebook, and download the finished `.ipynb` file for bCourses.

Weeks on Git, the command line, or local package management still require the local setup above. The assignment or lesson will say when local work is required. See [SETUP.md](SETUP.md) for the full local and Colab instructions.

## Contributors

- [Tom van Nuenen](https://github.com/tomvannuenen)
- [Pratik Sachdeva](https://github.com/pssachdeva)
- [Arul Murugan Renganathan](mailto:arul@berkeley.edu)
