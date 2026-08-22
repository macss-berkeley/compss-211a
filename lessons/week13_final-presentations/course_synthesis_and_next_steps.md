# Course synthesis and next steps

The course used many tools. The workflow worth keeping is shorter:

> source → representation → transformation → check → bounded claim → reproducible handoff

Use this guide after the final presentations to identify what you can now do, where your evidence is weakest, and what to practice next.

## Retrieve the course before looking anything up

Write short answers from memory. Then use your course materials to check and improve them.

1. **Environment:** Where did your code run, which environment or runtime did it use, and what state would disappear in a fresh session?
2. **Files and paths:** What makes a path portable across a collaborator's computer and Colab?
3. **Git:** What evidence distinguishes an uncommitted change, a local commit, a pushed commit, and a published artifact?
4. **Structured data:** How can two files look similar while representing different values or types?
5. **API acquisition:** Which request bounds, pagination choices, and platform coverage decisions shaped the records you observed?
6. **Generated code:** What contract and known-answer test would expose a plausible but silent error?
7. **Text preprocessing:** Which transformation can erase evidence that your research question needs?
8. **Text representations:** What information is kept and lost by counts, TF-IDF, and a lower-dimensional document representation?
9. **Evaluation:** What is the difference between a method disagreement, an error against human evidence, and a construct-validity problem?
10. **Cloud and LLM workflows:** What data leave your machine, what costs or limits shape the workflow, and what provenance must be recorded?
11. **Interpretation:** What is the strongest claim your project evidence supports? What claim would be too strong?
12. **Handoff:** What would a new collaborator need to rerun, audit, and extend the project?

## Look across the final projects

For three projects other than your own, record:

- one strong link between question and evidence;
- one consequential data or preprocessing choice;
- one validation strategy worth borrowing;
- one limitation that changed the interpretation;
- one element that made the work easier to reproduce.

Then identify a pattern across projects: Which problems were primarily technical, and which required social-science judgment that no tool could supply?

## Preserve your project as a research handoff

After grading is complete and consistent with the instructor's repository policy:

- retain the final report, slides, repository URL, and fixed code reference;
- retain environment and data-provenance records;
- archive only data you are permitted to keep;
- remove expired credentials and rotate any credential that may have been exposed;
- write down unresolved failures, maintenance risks, and the next evidentiary step;
- preserve AI-assistance disclosures with the project record;
- decide who owns or maintains shared repositories after the course.

Do not assume a hosted notebook, API, model, package, or public dataset will remain unchanged.

## Choose the next skill from a research need

Avoid choosing the next tool only because it is new. Start with the limitation you encountered.

- If **acquisition** was fragile, practice API documentation, request logging, caching, and data provenance.
- If **cleaning or reconciliation** was fragile, practice schemas, validation, testing, and typed data workflows.
- If **collaboration** was fragile, practice smaller commits, issue tracking, pull-request review, and release tagging.
- If **text analysis** was fragile, deepen corpus design, annotation, error analysis, and measurement validity before adding a more complex model.
- If **LLM output** was fragile, practice structured output, validation, baselines, manual review, cost tracking, and stopping rules.
- If **reproducibility** was fragile, practice clean-environment runs, scripts, configuration, and documented data pipelines.
- If **interpretation** was fragile, return to research design, sampling, measurement, uncertainty, and causal reasoning.

UC Berkeley's [D-Lab workshops](https://dlab.berkeley.edu/events/workshops) are one place to continue building methods in response to those needs.

## A personal operating agreement

Complete these sentences:

- Before I trust code that runs, I will …
- Before I interpret a model output, I will …
- Before I share data or send text to a service, I will …
- Before I make a claim about a population, I will …
- Before I hand a project to someone else, I will …
- When AI assists my work, I remain responsible for …

## Final reflection

Without using your slides, write your project's complete evidence chain and mark its weakest link. Then name one concrete action that would strengthen that link.

Return to the [presentation and Q&A guide](presentation_and_qa_guide.md) or the [final submission checklist](final_submission_checklist.md) as needed.
