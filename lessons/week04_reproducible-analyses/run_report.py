"""Read the 311 extract and save a request summary."""

import pandas as pd
import case_summary

requests = pd.read_csv(
    "data/sf311_requests.csv", dtype={"request_id": "string", "district": "Int64"}
)
summary = case_summary.summarize_requests(requests, group_by="district")
summary.to_csv("outputs/request_summary.csv", index=False)
print(summary.to_string(index=False))
print("Saved outputs/request_summary.csv")
