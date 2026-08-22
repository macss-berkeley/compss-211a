# Optional Week 4 practice

Use a disposable copy of `bash_lab/`. Do not perform these tasks in the original course repository.

Try the core tasks without AI first. Record the commands you used in a plain-text file only if that helps you review; there is no separate submission for this optional practice.

## 1. Orient and inspect

1. Print the current working directory.
2. List the fixture's directories.
3. Show the first five lines of `data/sample.csv`.
4. Explain why `wc -l data/sample.csv` reports one more line than the number of data records.

## 2. Paths and quoting

1. Try to display `data/small one.json` without quotes and read the error.
2. Repair the command with quotes.
3. Find every filename below `data/` that contains a space.

## 3. Search and compose

1. Find all case-insensitive occurrences of `error` in `logs/` with filenames and line numbers.
2. Pipe that output into a command that counts the matches.
3. Predict the count before running the complete pipeline.
4. Write the matching lines to `generated/error_report.txt`, then inspect the file.

## 4. Run a Python process

1. Run `scripts/summarize_csv.py` on `data/sample.csv`.
2. Check the exit status immediately.
3. Run the script on a path that does not exist.
4. Check the new exit status and explain the difference.

## 5. Write a rerunnable Bash script

Create `audit_errors.sh` that:

- creates `generated/` if necessary;
- writes all case-insensitive log-error matches to `generated/error_report.txt`;
- prints the number of matching lines;
- can be run twice without duplicating output.

Run it with:

```bash
bash audit_errors.sh
```

## 6. Git recovery in a disposable repository

Initialize Git inside the disposable copy and make one baseline commit. Then:

1. add one unverified line to `docs/notes.md`;
2. inspect the changed path;
3. inspect the exact diff;
4. restore only that file;
5. verify that the working tree is clean;
6. display the short commit history.

Do not use `reset --hard` or another history-rewriting command.

## Retrieval check

Without running a command, answer:

1. How does a pipe differ from redirection?
2. Why must a path containing spaces be quoted?
3. What does a nonzero exit status tell you?
4. Why should `git diff` come before `git restore`?
5. Why does a Colab shell not represent the same state as your local project repository?
