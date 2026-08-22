# Week 13: final presentation and Q&A guide

Your presentation should make one argument the audience can follow: what you asked, what data you used, what you did, what you found, and where the result stops. A complicated method cannot rescue a weak question or an unsupported claim.

The syllabus currently allows about 10 minutes for each presentation and 3-5 minutes for questions. Follow the final order, timing, slide-upload instructions, and accommodations posted in bCourses.

## The argument to build

Use this chain as a check, not as a required slide order:

> question -> data and coverage -> preprocessing -> method -> checks -> result -> interpretation -> limitations -> handoff

### Question and answer

- State a specific social-science question.
- Explain why it matters beyond the dataset or method.
- Give the strongest answer your evidence supports.
- Match the scope of the answer to the scope of the data.

### Data and coverage

Tell the audience who or what produced the data, how you obtained them, the unit of analysis, the time period, and the consequential inclusion or exclusion rules. Show important record counts. Name what is missing or overrepresented and any access, licensing, privacy, or platform constraints.

Use precise language. "Works returned by this OpenAlex query" is safer than "Berkeley research" unless your design supports the broader phrase.

### Preprocessing and method

Choose at least one preprocessing or coding decision that could change the result. Explain what it kept, what it removed, and whether a plausible alternative changes the finding.

Name the method and explain why it fits the question. Include the parameters, thresholds, comparison method, or random seed that matter for interpretation. The audience needs the analytical logic, not a tour of library functions.

### Checks and results

Show how you checked the workflow. Depending on the project, that might include schema checks, known-answer tests, row counts, comparison with human labels, a baseline, a confusion table, document inspection, or a sensitivity analysis.

Include one concrete error, disagreement, ambiguous case, or surprising result. Code that ran without an exception has not yet passed this part of the presentation.

Present one or two results that answer the question. Make denominators, units, labels, and sample sizes visible. Separate description, association, prediction, and causation.

### Limits and handoff

State how the result might fail and what new evidence would reduce that uncertainty. Discuss privacy, representation, bias, or harm where they affect the analysis.

Briefly show how another researcher could inspect or rerun the project:

- repository organization and starting point;
- environment or runtime information;
- data access or reconstruction instructions;
- run order and expected outputs;
- final commit, release, or other approved reference;
- known failures and unresolved questions;
- each member's contribution;
- location of the AI-assistance disclosure and how generated work was checked.

Do not display credentials, private data, private AI conversations, or identifying information that was not approved for presentation.

## A possible ten-minute shape

This is a pacing aid, not a slide template or grading formula.

- **1 minute:** question, motivation, and answer
- **1.5 minutes:** data, unit of analysis, and coverage
- **1.5 minutes:** consequential preprocessing or coding decision
- **2 minutes:** method and validation
- **2 minutes:** results and one inspected error or ambiguous case
- **1 minute:** limitations, ethics, and implications
- **1 minute:** reproducibility, contributions, and handoff

Practice aloud. Decide who advances the slides, who watches the time, and how you will handle transitions.

## Make the slides readable

- Use type that remains legible from the back of the room or on a small screen.
- Label axes, legends, units, denominators, and sample sizes.
- Do not rely on color alone.
- Describe the important pattern in each visual aloud.
- Caption recorded media.
- Define abbreviations and method names when they first appear.
- Prefer one readable figure to a screen full of notebook output.

## If you use a live demonstration

A live demo is optional. Keep it short, rehearse it in the presentation environment, and prepare a screenshot or saved output that shows the same point. The presentation should continue if the network, API, Colab runtime, or local environment fails.

Never expose a key, private repository, personal path, or restricted data during a demo.

## Q&A

Questions should help the team explain its evidence and the limits of its claim.

Useful questions include:

- Who or what is represented in the data, and who or what is absent?
- Which preprocessing choice most affected the available evidence?
- What comparison, test, or inspected case gives you confidence in the result?
- What is the strongest claim the result supports? What would go too far?
- What would another researcher need to rerun or extend the analysis?

Keep questions concise and answerable. For presenters, it is fine to say, "We did not test that; here is how we would." Every team member should understand the whole project, even when speaking about one part.

## Before presentation day

- Review the [final submission checklist](final_submission_checklist.md).
- Download an offline copy of the deck in the requested format.
- Test links and media, but plan to present without them.
- Remove credentials, personal paths, private data, and unapproved identifying information.
- Make sure everyone knows the opening answer, the main limitation, and the repository handoff.
- Check bCourses for the final order, timing, upload procedure, and accommodations.

After the presentations, use [Course synthesis and next steps](course_synthesis_and_next_steps.md) to record what you want to carry into future work.
