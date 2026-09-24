# COMPSS 211A practice studio

A static course page with a cumulative self-check, private browser-saved ratings,
54 skill-specific quick checks, and nine deeper examples across filtering,
functions, and debugging. The checklist is the home page. All 57 skill titles
and their Open practice links lead directly to a stable #skill/<id> route.

## Weekly maintenance

The checklist defaults to **Covered through Week N**. It calculates the current
course week in the browser using `America/Los_Angeles`, so GitHub Pages needs no
weekly rebuild, scheduled workflow, or manual update. An open checklist refreshes
within a minute of a release and when the student returns to the tab.

`schedule.mjs` lists the actual Fall 2026 bCourses week-start dates. Week 1 begins
August 31 and lasts two calendar weeks; Week 2 begins September 14. Week 4 opens
September 28, and subsequent course weeks open each Monday at midnight Berkeley
time through Week 13 on November 30. Adjust that list for a revised calendar or
another semester. **Entire course** remains available for looking ahead; future
skills are labeled. This is a display filter, not an access restriction. It uses
the device clock. No “First introduced” filter remains.

Add or revise skill descriptions, resource links, and `releaseWeek` values there.
Keep each skill's `id` unchanged: saved ratings are tied to IDs, not row order.
The catalog is a snapshot of the Google Sheet, not a live connection to it.
SQL remains in the catalog; its current notebook link is provisional.

Students return to the same URL. Their ratings stay in localStorage under
`compss-211a-practice-v1`. The app does not send ratings or drafts to a server.
Progress does not automatically move between browsers or website origins.
Students can export a JSON backup and merge it on another device; newer ratings
and code drafts win, and practice results are combined. The app does not collect
student names, IDs, or grades. Normal host/CDN access logging still applies.

## Exercise behavior

`skill-checks.mjs` contains a unique question, answer choices, feedback, and hint
for each of the 54 quick-check skills. `exercises.mjs` contains the three deeper
activities, task variants, feedback rules, hints and worked solutions.
Filtering and debugging are guided prediction/diagnosis exercises, not a Python
editor. Functions execute real Python in a disposable-capable Web Worker using
Pyodide 314.0.7 from jsDelivr. No pandas or API credentials are needed. Download
failures have a retry path and notebook alternative; a Stop button and six-second
execution timeout handle runaway code. Code drafts survive stopping a run.
Passing an example never sets a self-rating automatically.

## Develop and publish

No build dependencies are required. Run `npm test` for the logic and Python
checks, and `npm run build` to assemble `dist/` for Sites hosting. The root files
can also be served as-is under the course's existing GitHub Pages `docs/practice/`
path. The parent course repository is not pushed by the private Sites deployment.

The current Sites deployment is an instructor-only prototype. Make a deliberate
audience decision before sharing it with students. A single stable student URL
is important so saved progress remains available across weekly updates.
