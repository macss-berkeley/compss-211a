# Final project submission checklist

Use this checklist to make the project understandable, runnable, and reviewable. It does not replace the syllabus, assignment rubric, or final bCourses instructions.

The current syllabus lists a final report PDF and code-repository URL due through bCourses on December 12, and it separately describes presentation slides, an individual appendix, an LLM usage log, and a peer evaluation. The instructor will confirm the exact deadline time, permitted file formats, group-versus-individual submission routes, filename rules, and whether a commit or release tag is required. Follow those posted logistics when they are more specific.

## Confirm the submission contract

Before submitting, identify which items are submitted once per team and which are submitted by every student.

### Team items described in the syllabus

- [ ] Final report in the required format
- [ ] Code-repository URL
- [ ] Presentation slides in the requested format and location
- [ ] Team-member and contribution statement

### Individual items described in the syllabus

- [ ] Individual appendix
- [ ] Required AI/LLM usage documentation
- [ ] Peer evaluation, if assigned through bCourses

- [ ] We checked the final bCourses announcement for exact grouping, filenames, formats, and deadlines.
- [ ] We know whether the instructor wants a branch, commit hash, release, or tag as the final code reference.
- [ ] We know whether revisions after presentation day are allowed and how they should be documented.

## Report and presentation agreement

- [ ] The research question is stated consistently across the report, deck, and repository.
- [ ] The strongest claim matches the data's actual coverage.
- [ ] Counts, dates, labels, units, and reported metrics agree across artifacts.
- [ ] Consequential preprocessing choices are documented rather than described only as "cleaning."
- [ ] Method and parameter descriptions match the code that produced the submitted results.
- [ ] Figures and tables can be traced to a documented script or notebook step.
- [ ] Error analysis, uncertainty, limitations, and social implications are substantive and consistent.
- [ ] Any changes made after the presentation are reflected in the final report and repository.

## Repository handoff

Pretend the reviewer has only the repository URL and no access to your team's memory.

### Access and orientation

- [ ] Course staff can open the repository.
- [ ] `README.md` states the project question, team members, and main result.
- [ ] The README identifies the supported execution route: local, Colab, or both.
- [ ] The README gives a numbered run order and names expected outputs.
- [ ] Folder and file names are meaningful; abandoned duplicates and accidental exports are removed or clearly archived.
- [ ] The repository points to the final commit, release, or tag requested by the instructor.

### Environment and execution

- [ ] Python and important package/runtime versions are recorded.
- [ ] Local dependencies are declared in `pyproject.toml` and locked in `uv.lock`; any Colab-only bootstrap is documented.
- [ ] Random seeds and important model, API, and prompt versions are recorded where relevant.
- [ ] Personal absolute paths have been replaced with portable relative paths or documented configuration.
- [ ] A fresh session can execute the intended workflow in the documented order.
- [ ] Notebooks have been restarted and run from top to bottom without relying on hidden state.
- [ ] Scripts report useful errors when required inputs are unavailable.

### Data and provenance

- [ ] The data source, retrieval or receipt date, filters, bounds, and unit of analysis are documented.
- [ ] Raw/source data are separated from processed or generated files.
- [ ] Data access or reconstruction instructions are complete.
- [ ] Files that cannot be shared have a lawful, privacy-preserving access explanation rather than a broken path.
- [ ] Important row counts, exclusions, missingness decisions, and deduplication rules are recorded.
- [ ] Data licensing, terms, attribution, and relevant ethical constraints are addressed.

### Validation and outputs

- [ ] The workflow contains checks appropriate to the project: schemas, required columns, uniqueness, allowed values, counts, known answers, or non-mutation tests.
- [ ] Evaluation uses the intended records and labels, with exclusions documented.
- [ ] At least one error, disagreement, ambiguous case, or sensitivity result is preserved in the analysis record.
- [ ] Generated figures and tables have stable names and match the report.
- [ ] Expected outputs can be distinguished from caches, temporary files, and local-only artifacts.
- [ ] Known failures and limitations are documented in the README or report.

## Privacy, credentials, and public exposure

- [ ] No API key, password, token, service-account file, or `.env` content is committed.
- [ ] No credential appears in notebook output, screenshots, Git history, logs, or shared AI transcripts.
- [ ] Private, sensitive, or identifying data are not included unless course staff explicitly approved their use and storage.
- [ ] Public repository and presentation materials do not disclose information that was appropriate only for a private analysis environment.
- [ ] If a secret was ever committed, the team notified course staff and rotated it; deleting the visible line alone is not sufficient.

## AI-assistance disclosure

- [ ] Every use required by course policy is disclosed in the designated report, appendix, code, or journal location.
- [ ] The disclosure identifies the tool and how it was used.
- [ ] Prompts or interaction links are included only when required and safe to share.
- [ ] The team explains how generated code, classifications, summaries, or interpretations were verified.
- [ ] The final wording distinguishes model output from human judgment and evidence.
- [ ] AI assistance did not expose credentials or data that were not approved for transmission.

## Team and individual accountability

- [ ] The contribution statement names concrete responsibilities rather than broad percentages alone.
- [ ] Each member can explain the complete evidence chain and reproduce or locate their contribution.
- [ ] Shared work and individual work are submitted through the correct bCourses routes.
- [ ] Outstanding disagreements or incomplete components are disclosed rather than concealed.

## Final five-minute check

- [ ] Open every submitted file.
- [ ] Open the repository URL in a browser and verify staff access.
- [ ] Copy the final code reference exactly as requested.
- [ ] Compare the final figure/table values against the report one last time.
- [ ] Confirm that bCourses shows the expected team or individual submission status.
- [ ] Save a local copy of the submitted report, slides, and submission confirmation.

Use the [presentation and Q&A guide](presentation_and_qa_guide.md) for the oral handoff and [Course Synthesis and Next Steps](course_synthesis_and_next_steps.md) for the final reflection.
