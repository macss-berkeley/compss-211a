# Bash/Zsh command-line cheat sheet

Use these commands in Terminal on macOS/Linux or Git Bash on Windows.

## Orient and navigate

| Goal | Command |
|---|---|
| Show the current directory | `pwd` |
| List visible entries | `ls` |
| List all entries with details | `ls -lah` |
| Change directory | `cd path/to/folder` |
| Move to the parent directory | `cd ..` |
| Return to the previous directory | `cd -` |
| Move to your home directory | `cd ~` |

## Inspect and find

| Goal | Command |
|---|---|
| Show the first five lines | `head -n 5 file.csv` |
| Show the last five lines | `tail -n 5 file.log` |
| Page through a text file | `less file.txt` (press `q` to quit) |
| Count physical lines | `wc -l file.csv` |
| Search, ignoring case, with line numbers | `grep -Hin "error" logs/*.log` |
| Find CSV files below `data` | `find data -name "*.csv" -type f` |
| Display a path containing spaces | `cat "data/small one.json"` |

## Create and copy safely

| Goal | Command |
|---|---|
| Create a directory if needed | `mkdir -p generated` |
| Copy one file | `cp source.txt generated/source.txt` |
| Rename or move one file | `mv old_name.txt new_name.txt` |
| Create an empty file | `touch notes.txt` |

Practice these commands only inside the disposable Week 4 directory.

Deletion commands are intentionally omitted. Use the Finder/Explorer trash for course practice unless an instructor gives a specific disposable target.

## Compose commands

| Goal | Command |
|---|---|
| Count matching lines | `grep -Hin "error" logs/*.log \| wc -l` |
| Write output, replacing the target | `command > output.txt` |
| Append output | `command >> output.txt` |
| Run the second command only after success | `command1 && command2` |
| Print the previous exit status | `echo $?` |

Preview output before adding `>` or `>>`.

## Python scripts

| Goal | Command |
|---|---|
| Display the course Python version | `uv run python --version` |
| Display the course Python executable | `uv run python -c "import sys; print(sys.executable)"` |
| Run a script | `uv run python scripts/inspect_data.py` |
| Run a script with one path argument | `uv run python script.py data/file.csv` |

## Reversible Git diagnosis

| Question | Command |
|---|---|
| What paths have changed? | `git status --short` |
| What changed in working files? | `git diff` |
| What changed in one file? | `git diff -- path/to/file` |
| What recent commits exist? | `git log --oneline --decorate -5` |
| Restore one uncommitted working file | `git restore -- path/to/file` |

Inspect before restoring. This reference does not use history-rewriting commands.

## Keyboard shortcuts

| Goal | Shortcut |
|---|---|
| Complete a command or path | `Tab` |
| Recall earlier commands | Up/Down arrows |
| Search command history | `Ctrl-R` |
| Stop the current process | `Ctrl-C` |
| Move to start/end of line | `Ctrl-A` / `Ctrl-E` |
| Clear the display | `Ctrl-L` |
| Leave `less` | `q` |
