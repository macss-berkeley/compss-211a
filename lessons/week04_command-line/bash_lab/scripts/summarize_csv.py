#!/usr/bin/env python3
"""Print a small, dependency-free structural summary of one CSV file."""

from __future__ import annotations

import csv
from pathlib import Path
import sys


def summarize_csv(path_text: str) -> int:
    path = Path(path_text)
    if not path.is_file():
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        return 2

    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        rows = list(reader)

    if not rows:
        print(f"file={path} data_rows=0 columns=0")
        return 0

    header, data_rows = rows[0], rows[1:]
    print(f"file={path}")
    print(f"columns={len(header)} names={','.join(header)}")
    print(f"data_rows={len(data_rows)}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("USAGE: python summarize_csv.py PATH_TO_CSV", file=sys.stderr)
        raise SystemExit(2)
    raise SystemExit(summarize_csv(sys.argv[1]))
