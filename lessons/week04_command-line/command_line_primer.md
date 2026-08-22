# Command-line primer

The command line lets you work with a computer by entering text commands. Three related terms are worth separating:

- The **terminal** is the window where you type and see output.
- The **shell** reads your command and decides how to run it.
- **Bash** and **Zsh** are two common shells. Git Bash supplies a Bash-like environment on Windows.

For this course, the differences between Bash and Zsh rarely matter. The important point is that the terminal is the interface and the shell is the program interpreting what you type.

## Why use it?

A graphical interface is often easier for one-off actions. The command line becomes useful when you need to:

- repeat the same sequence of steps;
- inspect many files without opening them one at a time;
- connect small programs with pipes;
- run Python scripts with explicit inputs;
- work on a remote computer; or
- leave a readable record of a workflow.

The goal is not to memorize commands. It is to know where you are, name the intended input, predict what will change, and check the result.

## The four questions to ask

Before running a command, ask:

1. **Where am I?** Use `pwd`.
2. **What is here?** Use `ls` or `ls -lah`.
3. **What exact path will the command read or change?** Resolve relative paths from the current working directory.
4. **How will I check the result?** Inspect output, an exit status, or Git state.

## Command anatomy

```text
command  option  argument
ls       -lah    data
```

- A **command** names the program or shell feature to run.
- An **option** changes its behavior.
- An **argument** supplies a target or value.
- A **process** is a running instance of a program.

Use `command --help`, `man command` on macOS/Linux, or `help command` for Bash built-ins such as `cd`.

Your prompt may display a username, computer name, current folder, and a symbol such as `$` or `%`. Prompt designs vary. The cursor at the end is the part that matters: it marks where your input begins. Do not copy the prompt symbol when a guide shows a command.

## Paths and working directories

- An **absolute path** starts at the file-system root.
- A **relative path** starts at your current working directory.
- `.` means the current directory.
- `..` means the parent directory.
- `~` means your home directory.
- `cd -` returns to the previous working directory.

Tab completion reduces typing errors. Use it whenever possible.

Suppose a project looks like this:

```text
project/
├── data/
│   └── sample.csv
└── scripts/
    └── summarize_csv.py
```

If the working directory is `project/`, `data/sample.csv` is a relative path. The full location beginning at the file-system root is its absolute path. If the working directory is `project/scripts/`, the same data file is `../data/sample.csv`.

Try a short navigation cycle in the disposable Week 4 directory:

```bash
pwd
ls
cd data
pwd
ls
cd ..
pwd
```

After each `cd`, use `pwd` rather than relying only on how the prompt looks.

## Quoting and globbing

Spaces normally separate shell arguments. Quote a path that contains spaces:

```bash
cat "data/small one.json"
```

The shell expands a glob such as `*.csv` into matching filenames before the command starts:

```bash
ls data/*.csv
```

Quote a pattern when the called program, rather than the shell, should interpret it:

```bash
find data -name "*.csv" -type f
```

Do not combine a broad glob with a destructive command.

## Inspect before changing

Use small views instead of opening a large file blindly:

```bash
head -n 5 data/sample.csv
tail -n 5 logs/app_2025.log
wc -l data/sample.csv
grep -Hin "error" logs/*.log
find data -name "*.json" -type f
```

`wc -l` counts physical lines. A CSV with one header line and ten records has eleven physical lines.

Use `cat` for a very small text file and `less` for a file that would fill the screen. Press `q` to leave `less`. Press `Ctrl-C` when you need to stop a running command and return to the prompt.

## Create, copy, and rename safely

Practice file changes only in the disposable copy made during class:

```bash
mkdir -p scratch
touch scratch/notes.txt
cp docs/notes.md scratch/notes_copy.md
mv scratch/notes_copy.md scratch/notes_from_docs.md
ls -lah scratch
```

- `mkdir -p` creates a directory and does nothing harmful if it already exists.
- `touch` creates an empty file when the path does not exist.
- `cp` leaves the source in place and writes a copy at the destination.
- `mv` moves a file or gives it a new name.

The course references omit shell deletion commands. Use Finder or Explorer to move practice files to the trash unless an instructor has identified an exact disposable target.

## Pipes and redirection

A pipe sends standard output from one process to the next:

```bash
grep -Hin "error" logs/*.log | wc -l
```

Redirection sends output to a file:

```bash
grep -Hin "error" logs/*.log > error_report.txt
```

- `>` creates or replaces the target file.
- `>>` appends to the target file.
- Neither operator changes the input files.

Preview the command without redirection first. Then inspect the written file.

## Running a Python script

```bash
python scripts/summarize_csv.py data/sample.csv
echo $?
```

The final command prints the previous process's exit status. Zero normally means success; nonzero means the process reported another outcome or failure. Check it immediately because running another command replaces the saved status.

## Small Bash scripts

A Bash script records commands that should be rerun in the same order:

```bash
#!/usr/bin/env bash

mkdir -p generated
grep -Hin "error" logs/*.log > generated/error_report.txt
wc -l generated/error_report.txt
```

Run it with `bash audit_errors.sh`. A useful script is **idempotent** when rerunning it produces the same correct end state instead of duplicating work.

## Git as diagnostic evidence

These commands answer different questions:

```bash
git status --short                 # Which paths differ from the recorded state?
git diff -- docs/notes.md          # What changed in this working file?
git log --oneline --decorate -5    # What recent commits exist?
git restore -- docs/notes.md       # Restore this uncommitted working-file change
```

Always inspect `status` and `diff` before `restore`. `git restore` discards the named uncommitted working-file change; it does not rewrite commit history.

## Local terminal versus Colab

Colab can run shell commands, but its hosted runtime has a different file system, temporary state, and no necessary connection to your local Git repository. This week uses the local terminal so the paths, Python process, and Git state all refer to the project on your computer.

## A useful first workflow

The following sequence captures most of the week's mental model:

```bash
pwd
ls -lah
head -n 5 data/sample.csv
grep -Hin "error" logs/*.log
grep -Hin "error" logs/*.log | wc -l
python scripts/summarize_csv.py data/sample.csv
echo $?
git status --short
```

Read it as a story: orient, inspect, search, compose, run another program, check its status, then inspect repository state.

## Stop conditions

Pause and ask for help when:

- `pwd` does not show the disposable practice directory;
- a command targets more files than you intended;
- an output redirection would replace a file you need;
- `git diff` shows changes you do not recognize;
- a command proposes deleting files or rewriting Git history.
