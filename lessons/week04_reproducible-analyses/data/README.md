# SF311 request extract

`sf311_requests.csv` contains 16,876 requests opened August 3–9, 2026, downloaded from [311 Cases on DataSF](https://data.sf.gov/City-Infrastructure/311-Cases/vw6y-z8j6) on September 22, 2026. One row represents one request. Status and closure information reflect the download date, rather than the end of the opening week.

The extract selects every source record with `requested_datetime` from August 3 at 00:00 up to, but not including, August 10 at 00:00, using the source's timestamp values. Keep this CSV unchanged when rerunning the report; a later download may contain different values.

## Columns

| Column | Source field | Meaning |
| --- | --- | --- |
| `request_id` | `service_request_id` | Request identifier; read as text |
| `opened_at` | `requested_datetime` | Recorded opening timestamp |
| `closed_at` | `closed_date` | Recorded closure timestamp; may be missing |
| `status` | `status_description` | Open or Closed at extraction |
| `category` | `service_name` | Request type, using the source label |
| `channel` | `source` | Reporting channel, such as Phone or Web; may be missing |
| `district` | `supervisor_district` | Supervisorial district; may be missing |
| `hours_to_close` | Calculated | Elapsed hours between opening and closure when nonnegative; otherwise blank |
| `duration_note` | Calculated | `Recorded`, `No closure recorded`, or `Closure before opening` |

## Preparation and reporting decisions

The seven source fields above were retained and renamed. District labels such as `5.0` were written as `5`; category and channel labels were preserved, including `Test`. Addresses, coordinates, photos and other fields are outside this extract. No request rows were filtered out after the opening-date selection.

`hours_to_close` is calculated from the original timestamps. A missing closure timestamp or a closure preceding opening leaves the duration blank. The request still counts in the report; its duration does not enter the median. Missing and negative durations are not replaced with zero. The original timestamps are retained so these decisions can be checked.

There are 72 missing channels and 110 missing districts. These groups can overlap with requests lacking usable durations. The summary function retains requests with missing district labels in a separate group, shown as `<NA>` in the notebook and a blank district in CSV output.

## Interpretation

Recorded closure is an administrative event; it does not establish whether or when the underlying problem was resolved. The extract covers requests made during one selected week, not all problems or needs across the city. Medians describe the requests with usable durations, so read them alongside the request and usable-duration counts. Consult the [city's dataset explanation](https://sfdigitalservices.gitbook.io/dataset-explainers/311-cases) for coverage, repeated reports and channel definitions.

## License

The source is licensed under the [Open Data Commons Public Domain Dedication and License](https://opendatacommons.org/licenses/pddl/1-0/).
