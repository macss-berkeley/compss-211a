# Course setup

You may complete most course notebooks either locally or in Google Colab. The local route is required for work involving the command line, Git, or project environments.

## Local setup

The course uses `uv` to install the right Python version and the packages recorded in `uv.lock`. You do not need to install Python, Conda, or a separate Jupyter kernel first.

### 1. Install uv

On macOS or Linux, open a terminal and run the installer from the [official uv documentation](https://docs.astral.sh/uv/getting-started/installation/):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows, open PowerShell and run:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Close and reopen the terminal, then check the installation:

```bash
uv --version
```

### 2. Download the course repository

```bash
git clone https://github.com/macss-berkeley/compss-211a.git
cd compss-211a
```

If you already cloned the repository, open a terminal in that folder and run `git pull` instead.

### 3. Create the course environment

```bash
uv sync --frozen
```

This creates a private `.venv` folder inside the repository. It also installs Python 3.13 if your computer does not already have a compatible version. The command uses `uv.lock`, so everyone receives the same tested package versions.

### 4. Install VS Code and its Python tools

Install [Visual Studio Code](https://code.visualstudio.com/) and these two
Microsoft extensions from the Extensions view:

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

You need both extensions to edit Python comfortably and run `.ipynb` notebook
cells inside VS Code.

### 5. Open the repository in VS Code

From the repository folder, run:

```bash
code .
```

If the `code` command is unavailable, open VS Code, choose **File -> Open
Folder**, and select the complete `compss-211a` repository. Do not open only an
individual notebook file; opening the repository lets VS Code discover the
course environment and data files.

### 6. Select the course environment

1. Open the VS Code Command Palette with <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>
   on macOS or <kbd>Control</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on Windows/Linux.
2. Run **Python: Select Interpreter**.
3. Choose the interpreter inside this repository's `.venv` folder. Its path
   ends in `.venv/bin/python` on macOS/Linux or `.venv\Scripts\python.exe` on
   Windows.
4. Open an `.ipynb` file, click **Select Kernel** in the upper-right corner,
   choose **Python Environments**, and select the same `.venv` environment
   running Python 3.13.

VS Code now starts the notebook backend when you run a cell. You do not need to
run `uv run jupyter lab` or create a separately registered kernel named
`compss211`.

### Optional: use JupyterLab in a browser

VS Code is the default local workflow. If you prefer the browser interface for
a particular session, you can still run:

```bash
uv run jupyter lab
```

To stop JupyterLab, return to the terminal and press <kbd>Control</kbd>+<kbd>C</kbd>.

## Google Colab

Colab is a supported alternative for most notebooks:

1. Open [Google Colab](https://colab.research.google.com/).
2. Choose **File -> Open notebook -> GitHub**.
3. Enter `https://github.com/macss-berkeley/compss-211a` and choose a notebook.
4. Choose **File -> Save a copy in Drive** before editing.

The command-line, Git, and local-environment exercises still require the local setup. Individual notebooks will say when that is the case.

## Updating later

After pulling new course materials, refresh your environment with:

```bash
git pull
uv sync --frozen
```

Then reopen the repository in VS Code. If it was already open, verify that the
notebook kernel still points to the repository's `.venv` environment.

## What the setup files do

- `pyproject.toml` is the readable list of packages and the supported Python version.
- `uv.lock` is the exact, computer-generated record that makes installs reproducible.
- `.python-version` tells uv which Python version to use for this project.
- `.venv/` is the local environment uv creates on your computer. Git ignores it.
- `requirements-colab.txt` contains only the occasional additions needed in Colab.

Students should not edit these files or run `uv add` for ordinary course work. If an assignment appears to need another package, ask the instructional team first.

## If something goes wrong

First make sure the terminal is in the course repository. The command `pwd` on macOS/Linux or `Get-Location` in PowerShell should end in `compss-211a`.

Then run these checks:

```bash
git status
uv --version
uv run python --version
uv run python -c "import pandas; print(pandas.__version__)"
```

In VS Code, also confirm that the Microsoft Python and Jupyter extensions are
enabled and that both the selected interpreter and notebook kernel point to
`.venv`. If `.venv` is not listed, run **Python: Select Interpreter -> Enter
interpreter path** and select it directly.

Copy the complete output when asking for help. Do not delete `.venv/` or reinstall several Python distributions unless the instructional team asks you to; the error message usually points to a smaller fix.
