# Week 4: Command line and Python scripts

This week uses a **local terminal and text editor** as the live workspace. There is no lecture notebook. Google Colab remains available for notebook-based work in other weeks, but it does not replace the local file-system and repository practice in this lesson.

## Before Monday

Update or download the course repository, then open it in VS Code. Open the VS Code terminal, choose Git Bash if you use Windows, and run:

```bash
git --version
uv run python --version
uv run python -c "import sys; print(sys.executable)"
```

Run these commands from the repository folder. `uv run` uses the course environment, so you do not need to activate it yourself.

Confirm that the Week 4 folder contains `bash_lab/`.

## Learning goals

By the end of the week, you should be able to:

- identify the current working directory and resolve relative paths;
- distinguish the terminal from the shell and read basic command anatomy;
- inspect and search files before changing them;
- create, copy, and rename files inside a disposable directory;
- explain quoting, globbing, pipes, and redirection;
- move a few familiar lines of Python from a notebook into a `.py` file;
- run, edit, and rerun a Python script from the repository folder;
- explain why the working directory affects relative paths in a script;
- recognize an exit status and, optionally, record commands in a small Bash script;
- use `git status`, `git diff`, `git log`, and `git restore` for reversible diagnosis.

## Materials

- [Command-line primer](command_line_primer.md): concepts and safety habits
- [Command-line cheat sheet](command_line_cheatsheet.md): compact command reference
- [`bash_lab/`](bash_lab): a small synthetic file tree copied to a disposable location during lecture; students will add a simple Python script to their copy
- [Optional practice](optional_practice.md): additional no-AI rehearsal after class

## Reading

Read the first two items before class; use the third as a reference during and after class:

1. Software Carpentry, [Navigating Files and Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html)
2. Software Carpentry, [Working With Files and Directories](https://swcarpentry.github.io/shell-novice/03-create.html)
3. Software Carpentry, [Pipes and Filters](https://swcarpentry.github.io/shell-novice/04-pipefilter.html)

## Safety rule

Before a command changes a file, say or write down:

1. where you are;
2. which exact path the command targets;
3. how you will inspect the result;
4. whether the change is reversible.

Do all practice in the disposable copy created during class, not in the original course repository.

The primer adapts selected explanations and exercises from D-Lab's Command-Line Fundamentals workshop for this course's shorter, research-workflow-focused lesson.
