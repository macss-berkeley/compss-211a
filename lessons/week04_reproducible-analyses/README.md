# Week 4: Building Reproducible Analyses

**Open [week04_scripts.ipynb](week04_scripts.ipynb).**
The project contains analysis code, saved results and a data extract. In class,
we will use the results and code to establish what the project does, then
investigate and extend it.

## Learning goals

1. Understand and run an existing analysis project.
2. Extend its code, reuse a calculation and verify the resulting report.

## Get ready

Use the [course setup](../../SETUP.md) and local VS Code. No additional reading is required.

1. Update your course repository.
2. Copy this entire `week04_reproducible-analyses` folder outside the repository,
   such as to your Desktop. Keep its name, `data` and `outputs` folders.
3. Open your copy as the folder in VS Code, then open `week04_scripts.ipynb`.
4. Select the existing course Python environment for VS Code and the notebook,
   then open a new terminal. The interpreter is in your course repository's `.venv`;
   ask the teaching team if it is not listed or the terminal uses another environment.

## Project files

```text
week04_reproducible-analyses/
├── week04_scripts.ipynb       analysis code and saved results
├── case_summary.py           shared calculations
├── run_report.py             steps that generate a report
├── data/sf311_requests.csv    input records
└── outputs/                  generated reports
```

The notebook runs without edits. The script also works from the start:
`python run_report.py`, run from `week04_reproducible-analyses` in the course environment,
saves `outputs/request_summary.csv`. Keep the input CSV unchanged.

This project was written for the course using 16,876 real
[San Francisco 311 requests](https://data.sf.gov/City-Infrastructure/311-Cases/vw6y-z8j6)
opened August 3–9, 2026 and downloaded September 22, 2026. This is a teaching project, not an official city report. Column definitions and preparation
notes are in the [data reference](data/README.md).

## Friday practice

Use [Lab 4: Run, adapt, and check a report](../../lab/lab04_run_adapt_check.ipynb).
The 60-minute section uses a fresh copy of the same SF311 project. You will run
the baseline, repair a relative-path error, reuse a function and check a saved
category report. There is no additional graded submission.
