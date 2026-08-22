# Structured data: a field guide

Use this guide in Week 5, Lab 5, and HW3. The key question is not whether a file opens. It is whether a representation preserves the meaning needed for the analysis.

## The representation chain

```text
source → serialized file → Python objects → DataFrame → normalized table → checks → claim
```

- A **serialized file** stores data as text or bytes so it can be saved and exchanged.
- A **schema** states the expected fields, types, allowed values, missingness, and constraints.
- **Type inference** is a parser's guess. It is not the schema.
- **Normalization** here means converting representations to one agreed comparison form. It does not mean database normal forms.
- **Reconciliation** is an evidence-backed claim that normalized representations agree on stated invariants.

## Four common formats

| Format | Structure and strengths | Common losses or failures | Good fit |
|---|---|---|---|
| CSV | Flat rows and columns; widely supported; compact and easy to inspect | No standard stored types; delimiter, quoting, encoding, leading-zero, and missing-value problems | Simple tabular exchange |
| TSV | Like CSV, but tabs separate fields; useful when text contains many commas | Still flat and mostly untyped; tabs and newlines inside fields need care | Simple text-heavy tables |
| JSON | Objects, arrays, strings, numbers, booleans, and `null`; preserves nesting and basic scalar distinctions | Dates remain strings; records may be deeply nested; repeated keys add size; flattening can lose context | APIs and nested records |
| XML | Nested elements, attributes, order, and optional schema systems; mature interchange format | Verbose; values are often text until explicitly converted; namespaces and mixed content add complexity | Hierarchical interchange and schema-governed systems |

A format does not select itself. Choose according to the structure, downstream tools, validation needs, human readability, and preservation requirements.

## Week 5 fixture schema

The `week05_service_requests` files contain five fictional records. They do not describe real campus operations.

| Field | Normalized type | Contract |
|---|---|---|
| `request_id` | string | Required, unique, exactly six digits. Leading zeros are meaningful. |
| `opened_at` | UTC datetime | Required ISO 8601 timestamp. |
| `request_type` | string | Required descriptive category. |
| `status` | string | One of `open`, `pending`, or `closed`. |
| `district_code` | string | One of `NA`, `SA`, or `WA`. `NA` means **North Area** and is not missing. |
| `latitude` | number | Required. |
| `longitude` | number | May be missing. Request `000103` has the one intentional missing longitude. |
| `note` | string | Required short fictional description. |

The XML fixture contains one planted value mismatch for classroom diagnosis. Do not assume that a parser error caused it.

## Inspect before transforming

For every loaded table, check:

```python
print(frame.shape)
print(frame.columns.tolist())
print(frame.dtypes)
print(frame.isna().sum())
print("duplicate IDs:", frame["request_id"].duplicated().sum())
display(frame.head())
```

Ask what each missing value means. `None`, `NaN`, `pd.NA`, an empty string, and a literal code such as `"NA"` are not automatically equivalent.

## Load with the schema in mind

CSV and TSV need explicit treatment for identifiers and missing values:

```python
csv_rows = pd.read_csv(
    csv_path,
    dtype={"request_id": "string", "district_code": "string"},
    keep_default_na=False,
    na_values=[""],
)

tsv_rows = pd.read_csv(
    tsv_path,
    sep="\t",
    dtype={"request_id": "string", "district_code": "string"},
    keep_default_na=False,
    na_values=[""],
)
```

The `keep_default_na=False` choice matters here because `NA` is a legitimate district code. The explicit empty-string rule still treats a blank field as missing.

JSON commonly arrives as nested Python objects:

```python
import json

with open(json_path, encoding="utf-8") as handle:
    payload = json.load(handle)

json_rows = pd.json_normalize(payload["records"])
```

The course XML fixtures are trusted local files:

```python
from xml.etree import ElementTree as ET

root = ET.parse(xml_path).getroot()
xml_rows = pd.DataFrame(
    [{child.tag: child.text for child in item} for item in root.findall("service_request")]
)
```

Parsing arbitrary untrusted XML requires additional security care; that is outside this week's required work.

## Write the normalization contract first

Before coding, state:

1. required columns and their order;
2. identifier representation and uniqueness rule;
3. date/time convention;
4. numeric coercion rule;
5. text trimming and missing-value rule;
6. allowed categorical values;
7. row ordering and index convention;
8. behavior when a contract clause fails.

Do not silently repair evidence you no longer possess. If a parser removed leading zeros, re-read the source using the schema. Add zeros later only when an authoritative fixed-width rule justifies it.

## Reconciliation checklist

Normalize first, then compare:

- required columns are present;
- row counts match the expected count;
- IDs are nonmissing and unique;
- ID sets match;
- normalized dtypes match;
- missingness by field matches;
- values match for the same ID and field;
- any excluded metadata or fields are documented.

Equal row counts do not establish equivalence. When a check fails, report the affected ID, field, values, and likely source of the disagreement.

## Format-choice practice

For each case, choose a format and name one trade-off:

1. A flat table that collaborators must open in several spreadsheet tools.
2. An API response containing request metadata plus a nested list of records.
3. A long-lived exchange between organizations that already validate hierarchical records against an agreed schema.

There can be more than one defensible answer. The explanation must connect the choice to the use case.

## Five retrieval questions

1. Why is a six-digit ID a string rather than an integer?
2. Why can a successful parser still damage meaning?
3. What is the difference between a parser's inferred type and a schema type?
4. What evidence beyond row count supports reconciliation?
5. When can two differently ordered tables still be equivalent?
