# SF311 request data

`sf311_requests.csv` contains 16,876 requests opened August 3–9, 2026. Each row is one request. The records were downloaded from [311 Cases on DataSF](https://data.sf.gov/City-Infrastructure/311-Cases/vw6y-z8j6) on September 22, 2026.

## Columns

| Column | Source field | Meaning |
| --- | --- | --- |
| `request_id` | `service_request_id` | Request ID; read as text |
| `opened_at` | `requested_datetime` | Recorded opening time |
| `closed_at` | `closed_date` | Recorded closure time; may be missing |
| `status` | `status_description` | Open or Closed when downloaded |
| `category` | `service_name` | Request type, with the city's label |
| `channel` | `source` | How the request was reported, such as Phone or Web; may be missing |
| `district` | `supervisor_district` | Supervisorial district; may be missing |
| `hours_to_close` | Calculated | Hours from opening to closure; blank if closure is missing or recorded before opening |
| `duration_note` | Calculated | `Recorded`, `No closure recorded`, or `Closure before opening` |

## File preparation

The file keeps the seven source columns listed above, with shorter names, and adds two calculated columns. District values such as `5.0` were changed to `5`. Category and channel labels are unchanged, including `Test`. Addresses, coordinates, photos and other source columns were left out. All requests from the selected opening dates were kept.

`hours_to_close` comes from subtracting the opening time from the closure time. If closure is missing or recorded before opening, the duration is left blank. That request still counts in the report, but contributes no value to the median. A blank duration is never filled with zero. The original timestamps are in the file if you want to check the calculation.

There are 72 requests without a channel and 110 without a district. Some of these also lack a usable duration. The summary function keeps requests without a district together in one group. Its district label appears as `<NA>` in the notebook and is blank in the output CSV.

## Reading the results

A closure timestamp records when a request was marked closed in the system. It does not indicate whether or when the problem was fixed. These records cover the requests people made during one week; they cannot tell us about problems that went unreported.

The median uses only requests with usable closure times. Check `with_time` against `requests` to see how much of each group it describes. The [city's dataset explanation](https://sfdigitalservices.gitbook.io/dataset-explainers/311-cases) provides more information on what 311 covers, repeated reports of the same incident and reporting channels.

## License

The source data are licensed under the [Open Data Commons Public Domain Dedication and License](https://opendatacommons.org/licenses/pddl/1-0/).
