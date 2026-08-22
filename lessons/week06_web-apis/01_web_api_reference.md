# Week 6 reference: acquiring data through web APIs

Keep this page open during Monday's OpenAlex lesson. The class notebook starts small because we will write the request, validation, traversal, and pagination code together.

## The acquisition pipeline

```text
research bound → HTTP request → response checks → raw evidence
               → JSON traversal → tidy table → checks → qualified claim
```

An API is an interface with rules. A successful request only shows that the server accepted the request and returned a response; it does not establish that the returned data are complete, representative, or appropriate for a particular claim.

## Request and response anatomy

A typical read-only API transaction contains:

- **endpoint:** the collection being requested, such as `https://api.openalex.org/works`;
- **method:** `GET` for this week's read-only requests;
- **parameters:** filters, selected fields, page size, and cursor, passed through a Python dictionary;
- **headers:** metadata about the request or response;
- **status code:** `200` for success, `400` for an invalid request, `404` for a missing resource, `429` for too many requests, and `5xx` for a server failure;
- **body:** for this case, a JSON object containing `meta`, `results`, and `group_by`.

Use `requests.get(endpoint, params=params, timeout=...)` rather than assembling a query string by hand. Check the status and content type before treating the body as JSON.

## Bound the request before running it

For OpenAlex, we will request a small set of 2024 works that have an abstract and at least one authorship associated with the UC Berkeley institution identifier `I95457486`.

OpenAlex query parameters use snake case, including `per_page`. Current list endpoints allow at most 100 results per page. Cursor pagination begins with `cursor="*"`; the response supplies `meta.next_cursor` for the next request.

Before collecting more than one page, write down:

1. the population rule expressed by the filters;
2. the fields actually needed;
3. the maximum pages or records to collect;
4. the stopping rule;
5. what will be cached and how duplicate identifiers will be checked.

## Credentials and safe inspection

Some APIs require a key; others allow small unauthenticated requests. Access rules can change. If a key is used:

- store it in a local environment variable or Colab Secret named `OPENALEX_API_KEY`;
- never paste it into a notebook cell;
- never commit `.env` or credential files;
- never print it;
- redact `api_key` from displayed URLs, logs, exceptions, screenshots, and saved provenance.

OpenAlex accepts a key as a query parameter, so an unredacted `response.url` may contain the secret.

## Validate before parsing

A minimum validation routine is:

1. use a finite timeout;
2. inspect the status code;
3. handle `429` and transient `5xx` responses with only a small, bounded number of retries;
4. call `raise_for_status()` for other failures;
5. confirm that the response is JSON;
6. inspect top-level keys and types;
7. test assumptions about required fields and identifiers.

Do not use an infinite retry loop. A cached fixture is the correct fallback when a live service is unavailable during class or grading.

## Raw evidence, processed data, and provenance

Keep the API response separate from the table derived from it. A small acquisition record should include:

- UTC retrieval time;
- endpoint and sanitized parameters;
- response status;
- pages and records retrieved;
- the stated collection bound;
- relevant rate-limit headers when supplied;
- whether downstream work used the live response or the tracked fixture.

Never store the API key in this record.

## JSON traversal and missing data

Inspect structure before flattening it. In an OpenAlex response:

```text
payload
├── meta
│   ├── count
│   ├── per_page
│   └── next_cursor
└── results
    └── one work
        ├── id
        ├── display_name
        ├── authorships
        ├── abstract_inverted_index
        └── primary_topic
```

Not every record has every field. Use explicit defaults and preserve missing values that carry meaning. OpenAlex represents many abstracts as an inverted index: a mapping from each token to its positions. Reconstruction requires sorting all `(position, token)` pairs.

## What the Berkeley filter means

Use this wording:

> works with at least one UC Berkeley-affiliated authorship

Do not call the result "papers by Berkeley faculty." Affiliation metadata may be incomplete or incorrectly matched; authors can have multiple affiliations; the result includes many kinds of works and people; and platform coverage reflects OpenAlex's sources and classification system. Citation counts, topics, and other metadata can also change after collection.

Public scholarly metadata still deserves data minimization and careful documentation. Collect only fields needed for the analysis.

## API versus scraping

Use an approved API when it supplies the needed data. If no suitable API exists, first check licenses, terms, robots guidance, privacy risk, and the stability of the proposed source. Scraping is an optional contrast in this course, not the Week 6 implementation task.

## Official references

- [OpenAlex quickstart](https://developers.openalex.org/quickstart)
- [OpenAlex works endpoint](https://developers.openalex.org/api-reference/works/list-works)
- [OpenAlex authentication and rate limits](https://developers.openalex.org/api-reference/authentication)
- [OpenAlex filtering](https://developers.openalex.org/guides/filtering)
- [Requests quickstart](https://requests.readthedocs.io/en/latest/user/quickstart/)
- [Socrata paging, for the HW3 transfer case](https://dev.socrata.com/docs/paging.html)

## Before Friday

Be ready to explain:

1. What does status `200` prove, and what does it not prove?
2. Why should pagination use a cursor or stable ordering?
3. Why must a credential be removed from request evidence?
4. Why is the phrase "Berkeley faculty papers" unsupported by this filter?
