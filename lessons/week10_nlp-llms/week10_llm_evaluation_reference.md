# Week 10 reference: structured LLM inference and fair evaluation

This week puts an LLM inside a research workflow. We will give it one defined task, validate the response, compare it with a baseline on the same records, inspect the errors, and decide whether the result is good enough to continue.

> defined task → structured response → semantic validation → same-data comparison → inspected errors → provenance and cost → claim that fits the evidence, or stop

## From Week 8 to Week 10

Earlier text pipelines often depended on token counts, lexicons, rules, and aggressive normalization. Those methods could erase negation, punctuation, emoji, word order, speaker context, and sarcasm cues. A contextual language model may perform better on examples such as `not safe` or `Love waiting forty minutes 🙃`, but improvement is an empirical question.

A model cannot recover context that was never collected. It also cannot decide whether a label is a valid social-science construct, whether the sample represents a population, or whether an error is acceptable for a real decision.

## Minimal conceptual model

`text → subword tokens → contextual vectors → next-token probabilities → generated sequence`

- **Tokens** are model units and are not necessarily words.
- **Contextual representation** lets the same token participate differently depending on surrounding tokens.
- **Attention** is a learned computational mechanism for mixing information across token positions. It is not human attention and is not a faithful explanation of reasoning.
- **Generation** repeatedly selects from predicted next-token distributions.

## Define the task first

For the synthetic campus-routing example, one document must receive exactly one of six labels:

`transit`, `study_space`, `accessibility`, `food`, `safety`, `services`

A valid record contains:

```json
{"document_id": "EV01", "label": "transit", "rationale": "The comment concerns shuttle hours."}
```

A response schema helps produce parseable JSON. It does not establish that the ID is the requested ID, the label is substantively correct, the rationale is meaningful, or the task itself is valid.

## Semantic validation boundary

Before a model record enters an analysis table, verify:

1. the result is an object with exactly the required fields;
2. `document_id` matches the requested record;
3. `label` is in the allowed set;
4. `rationale` is nonblank text;
5. every expected ID appears once and only once;
6. invalid records are rejected or sent to review, never silently rewritten.

Fluent rationales are generated text. They are useful audit artifacts but are not direct access to a model's internal reasoning.

## Compare methods fairly

Hold constant:

- evaluation document IDs;
- human reference labels;
- allowed prediction labels;
- exclusions and missing-data rules;
- scoring rules.

Report the denominator with accuracy. Inspect a confusion table to see which labels are exchanged. Then read the actual disagreement documents.

Keep three relationships separate:

- LLM versus traditional baseline;
- LLM versus human reference label;
- baseline versus human reference label.

Useful manual failure codes include negation, sarcasm/emoji, missing context, multiple issues, label-boundary ambiguity, and annotation uncertainty.

## Provenance, cost, and stopping

Record at least:

- model ID and prompt version;
- date/time and SDK version;
- live result versus recorded fixture;
- data snapshot or hash and document IDs;
- input and output tokens separately;
- input and output cost separately;
- failed/invalid records and retry rule;
- human-review or stopping rule.

Examples of stopping conditions:

- data transfer is not approved;
- a credential may have been exposed;
- invalid records cross the validation boundary;
- performance is below the predeclared threshold;
- errors concentrate in a consequential class or group;
- the evaluation data do not match the intended use.

## Credentials and privacy

- Keep API keys in an environment variable or Colab Secret. Never paste them into a notebook, output cell, screenshot, or repository.
- Live mode should be off by default.
- Use only the supplied synthetic teaching records for the course call unless a separate data-governance decision approves another dataset.
- Free and paid services can have different data-use and retention conditions. Dollar cost and privacy cost are different questions.

## Official references

Current facts below were checked **August 21, 2026**. Recheck shortly before class because APIs, model availability, prices, and terms change.

- [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Gemini API getting started](https://ai.google.dev/gemini-api/docs/get-started)
- [Gemini model list](https://ai.google.dev/gemini-api/docs/models)
- [API-key security](https://ai.google.dev/gemini-api/docs/api-key)
- [Token accounting](https://ai.google.dev/gemini-api/docs/tokens)
- [Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- [Zero data retention](https://ai.google.dev/gemini-api/docs/zdr)

## Prepare for Lab 10 and HW5

You should be able to explain:

- why valid JSON is necessary but insufficient;
- why two methods must be evaluated on identical documents;
- why a human reference label is part of a task definition, not unquestionable truth;
- why a small synthetic fixture cannot establish deployment or population validity;
- what evidence would require human review or stop automation.
