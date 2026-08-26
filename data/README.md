# Course data

This directory contains the local fixtures used by COMPSS 211 lessons, labs,
and homework. The homework and lab notebooks read these files from the
repository-level `data/` directory. These are teaching fixtures, not
final-project datasets.

## Synthetic and curated notebook fixtures

- `hw1_after_dark_commute_survey.csv`: 96 synthetic graduate commute records,
  with deliberate missing values and meaningful zeroes for remote rows.
- `hw2_hidden_berkeley_locations.csv`: eight public Berkeley resource
  references with conservative access notes and official URLs.
- `hw4_synthetic_campus_comments.csv`: 96 synthetic comments across six
  campus-related issue categories.
- `hw5_recorded_evaluation_fixture.csv`: deterministic synthetic labels for
  offline mechanics. These are not live Gemini outputs.
- `week08_preprocessing_signals.csv`: six short examples used to make
  negation, punctuation, capitalization, emoji, and missing context visible.
- `week10_campus_routing_fixture.csv`: 30 synthetic training records, 12
  synthetic evaluation records, and recorded predictions for the Week 10
  live evaluation. No API call is needed.
- `optional_sql_berkeley_services.sqlite`: a synthetic relational
  program/session database.

All synthetic generators use seed 211 where randomness is needed. These files
must not be described as observations about Berkeley students or campus
operations.

## Historical Reddit snapshots

- `aita_top_comments.csv` contains 5,000 highly scored historical comments from
  r/AmItheAsshole. Week 8 uses only `body` and `score`; usernames should not be
  displayed in class materials.
- `aita_top_subs.csv` contains 5,000 historical submissions from the same
  subreddit and includes titles, post text, scores, and platform metadata.

These convenience samples are not representative of Reddit users or public
opinion and may contain sensitive language. The original collection provenance
is not recorded in this repository, so confirm it before redistributing these
files outside the course.

## City of Berkeley 311 snapshot

The following four files contain the same 1,896 cases in different formats:

- `hw3_campus_edge_311_2025.csv`
- `hw3_campus_edge_311_2025.json`
- `hw3_campus_edge_311_2025.tsv`
- `hw3_campus_edge_311_2025.xml`

Source: City of Berkeley 311 Cases, Socrata dataset
[`p88g-6gs2`](https://data.cityofberkeley.info/resource/p88g-6gs2).

The snapshot covers records opened during 2025 within latitude 37.862 to
37.884 and longitude -122.274 to -122.244, ordered by `case_id`. Street
addresses are excluded. The rectangular bounds are a teaching choice, not an
official campus boundary.

## OpenAlex snapshot

`openalex_berkeley_abstracts_2024_sample.csv` contains a seed-211 sample of 80
works filtered to OpenAlex institution `I95457486`, ROR `01an7q238`, year 2024,
and abstract availability. Describe these as works with at least one UC
Berkeley-affiliated authorship. Affiliation metadata does not establish that
every author is Berkeley faculty or that Berkeley led the work.
