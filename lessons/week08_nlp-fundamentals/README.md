# Week 8: Text as Features

[Lecture slides](https://docs.google.com/presentation/d/112JpEieBbZnVBt4XcalQLf44H0y4WN1MBUmzhVE_zo4/edit)

**Monday:** [Describing patterns in text](week08_live_workspace.ipynb). Build word features for the cat/mat/rug documents, use sums and Boolean means to interpret the numbers, and experiment with repetition and word order. Then compare tiny TF-IDF weights and apply a word search to AITA replies. Adapt a supplied full-corpus count comparison to TF-IDF, compare ranked word lists, and investigate reply lengths.

**Friday:** [Describe word use across two groups](../../lab/lab08_campus_text_features.ipynb). A 30–40 minute coding task: choose a question, build a word-presence feature, compare two groups, and test a revised rule. Use your project texts or the AITA replies. Building a full count matrix is optional.

Optional: to use your project texts on Friday, one person per team makes `lab08_team_texts.csv` with columns `id`, `text`, and `group` (about 100–300 rows, no names or usernames) and puts it beside the lab notebook. The end of Monday’s notebook has code to make it. Existing ratings, periods, sources, or parties can define the groups. Teams without a file use the AITA replies.

Make notebook copies with `_mine` at the end of their names. No API key is needed. Keep project CSVs locally.

[NLP features reference](nlp_features_reference.md) · [Readings](curated_readings.md) · [Optional browser practice](https://macss-berkeley.github.io/compss-211a/interactives/week08-comparing-words-across-groups.html)
