# Package Management and Virtual Environments

**_Learning Objectives_:**  
1. Understand what virtual environments are and why they're essential for Python development
2. Learn to set up and manage Conda environments
3. Create and install Python packages using `pyproject.toml`
4. Understand collaborative workflow with package management

---

### Icons Used in This Notebook 
🔔 **Question**: A quick question to help you understand what's going on.<br>
🥊 **Challenge**: Interactive exercise. We'll work through these in the lab!<br>
💡 **Tip**: How to do something a bit more efficiently or effectively.<br>
⚠️ **Warning:** Heads-up about tricky stuff or common mistakes.<br>


## Returning to Your Final Project

Remember back in Week 3 when you created your final project repository? You committed some initial files and set up the basic structure. Now we're going to return to that `src` folder, but before we dive back in, we need to set up a proper development environment using virtual environments and package management.

🔔 **Question**: Do you remember where your final project repository is located on your machine?

## What Are Virtual Environments?

Imagine you're working on multiple Python projects. Project A needs version 1.0 of a library, but Project B needs version 2.0 of the same library. Without virtual environments, you'd have a conflict - you can only have one version installed globally on your system.

**Virtual environments** solve this problem by creating isolated Python environments for each project. Each environment can have its own set of packages and dependencies, completely separate from your system Python and other projects.

Think of dependencies like ingredients in a recipe - they're other pieces of code that your code needs to work properly. For example, if you're writing code to analyze data, you might need pandas (for working with spreadsheets), matplotlib (for making graphs), and numpy (for math). Just like you can't make cookies without flour, your Python code can't run without the specific libraries it needs.

Think of virtual environments like separate toolboxes:
- **Global Python**: Your main toolbox at home
- **Project A Environment**: A portable toolbox just for Project A
- **Project B Environment**: A separate portable toolbox just for Project B

Each toolbox contains only the tools (packages) needed for that specific project, and they don't interfere with each other.

### Why Virtual Environments Matter
- **Dependency Isolation**: Different projects can use different versions of the same package
- **Reproducibility**: Others can recreate your exact development environment
- **Cleanliness**: Keep your system Python clean and avoid conflicts
- **Collaboration**: Share your environment setup with teammates

**Note: If you already have installed Anaconda, please skip to "Creating a Conda Environment".**


## Introduction to Conda

**Conda** is both a package manager and an environment manager. Unlike pip (which only manages Python packages), Conda can manage packages from any language and handle complex dependencies more effectively.

### Why Use Conda?
Conda has some real advantages over other tools like pip:

- **Works everywhere**: Whether you're on Windows, Mac, or Linux, Conda works the same way. No more "it works on my machine" problems!
- **Not just Python**: Need to install R for statistics or Node.js for web stuff? Conda can handle it all in one place
- **Faster installs**: Conda downloads pre-built packages instead of compiling from scratch, so things install much quicker
- **Smarter about conflicts**: Ever had pip tell you it can't install something because of version conflicts? Conda is much better at figuring out what versions actually work together
- **Built for science**: If you're doing data analysis, machine learning, or scientific computing, Conda was designed with you in mind

## Setting Up Conda

If you have not done so yet, you have several options for installing Conda depending on your system:

### Option 1: Windows Users - Direct Download
1. Go to [https://conda.io/miniconda.html](https://conda.io/miniconda.html)
2. Download the Windows installer for Python 3.x
3. Run the installer and follow the prompts
4. Open "Anaconda Prompt" from your Start menu

### Option 2: Mac/Linux Users - Terminal Installation
```bash
# Download the installer
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh  # Linux
# OR
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh  # Mac Intel
# OR 
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh   # Mac M1/M2

# Run the installer
bash Miniconda3-latest-*.sh

# Follow the prompts and restart your terminal
```

🥊 **Challenge**: Set up Conda using the method appropriate for your system.

## Creating a Conda Environment

Now let's create a Conda environment for your final project using the provided environment file.

### Understanding environment.yml
The `environment.yml` file in the [final project template repo](https://github.com/compss211/final-project-template-repo) specifies all the packages and their versions needed for your project. This ensures everyone on your team has the exact same development environment.

```bash
# Navigate to your final project repository
cd path/to/your/final-project

# Create environment from the yml file
conda env create -f environment.yml

# Activate the environment
conda activate compss211
```

🔔**Question**: What do you see when you run `conda list` after activating your environment?

💡 **Tip**: Always run `conda activate compss211` when working on your final project to ensure you're using the correct environment.

## Installing Packages with Conda

Adding new packages to your environment is simple:

```bash
conda install package_name
```

Let's first install `ipykernel`, which acts as the backend engine that executes Python code in Jupyter Notebooks. It's built on IPython, an enhanced interactive Python shell.

```bash
conda activate compss211
conda install ipykernel
```

💡 **Tip**: If conda doesn't have a package, you can use `pip install package_name` within your activated environment. Conda installs packages from its own curated repositories, while pip installs from the Python Package Index (PyPI).

## Understanding Python Packages

A **Python package** is a way to organize related modules (Python files) together. It's like organizing your code into folders and subfolders, but with special files that make Python treat them as importable units.

This is useful in industry practice — instead of working with a tangle of Jupyter notebooks, you structure your code into reusable, testable, and shareable components. This makes it easier to:
- Keep your project organized as it grows
- Reuse functions and classes across different scripts or notebooks
- Collaborate with others using clear project structure
- Write tests and automate workflows
- Eventually package and distribute your code (e.g., with pip)

### Package Structure
```
final-project-template-repo/
├── src/
│   └── mypkg/              # This is your package
│       ├── __init__.py     # Makes it a package
│       ├── mymodule.py     # Module with functions
├── pyproject.toml          # Package configuration
└── README.md
```

## What is pyproject.toml?

The `pyproject.toml` file is the modern standard for configuring Python packages. It tells Python everything it needs to know about your package: what it's called, who wrote it, what other packages it needs to work, and how to build and install it. Think of it as an instruction manual that comes with your code.


### Your current pyproject.toml
```toml
[project]
name = "mypkg"
version = "0.0.1"
description = "Final Project Group Repository for COMPSS-211"
readme = "README.md"
requires-python = ">=3.10"
dependencies = []

[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
package-dir = {"" = "src"}
```
There's a lot of components here! The main things to note are the name of the package (first line), `package-dir`, which tells Python where your package is located (we've set it to the `src` folder).

## Customizing Your Package

🥊 **Challenge**: Let's customize your package name and structure.

### Step 1: Update pyproject.toml
1. Open the `pyproject.toml` file in your final project repository
2. Change the `name` field to something meaningful for your project
   - Example: `"climate-data-analyzer"` or `"recipe-optimizer"`
3. Update the `description`.

### Step 2: Rename Your Package Folder
1. Navigate to the `src` folder
2. Rename the package folder to match your project name
   - If you named your package `climate-data-analyzer`, rename the folder to `climate_data_analyzer`

⚠️ **Warning**: Use underscores in folder names, hyphens in package names!

### Step 3: Commit and Share Your Changes

Follow the collaborative workflow to push these changes to your common GitHub repo so that all your group members can pull those changes.

## Installing Your Package in Editable Mode

Now comes the exciting part - installing your own package!

### What is Editable Installation?
An **editable installation** (also called development mode) installs your package in a way that links directly to your source code. This means that changes to your code are immediately reflected without reinstalling. If you're working in a Jupyter notebook, and you set up a new function, you can add it to your `src` folder and it will be immediately available for you to use. You may need to restart your Jupyter kernel, but you do not need to reinstall the package.

### Installing Your Package

Let's install your package so that it's available in your Conda environment. First, navigate to the directory containing `pyproject.toml` using the command line, and then run a `pip install` command:

```bash
cd path/to/your/final-project

# Install in editable mode
pip install -e .
```

The `.` tells pip to install the package in the current directory, and `-e` makes it editable.

### Testing Your Installation
Let's test that your package is properly installed by importing a file from it. Create a new Jupyter Notebook in the `notebooks/` folder, and activate the Python kernel `compss211` you just created.

Then, in a code cell, run the following import. You'll need to use your `PACKAGE_NAME`, which you changed from `mypkg` earlier.

```python
# Import the test function from your package
from [PACKAGE_NAME].mymodule import test

# Run the test function
test()
```

🔔 **Question**: What output do you see when you run `test()`?

## The Power of Editable Packages

The beauty of editable installations is that changes are immediately reflected. Let's test this:

🥊 **Challenge**: Make a change and see it in action!
1. Open `src/your_package_name/mymodule.py`
2. Find the `test()` function.
3. Change the print statement to something different.
4. Save the file.
5. Restart your kernel and run `test()` again. Don't forget to import it!

🔔 **Question**: Do you see your new message without reinstalling anything?

## Collaborative Package Development

Now let's practice collaborative workflow with packages:

🥊 **Challenge**: Add a useful function that everyone can use.

### Step 1: Create a New Module
1. Create a new Python file in your package directory (e.g., `utils.py`)
2. Add a function that could be useful for your groupmates:

```python
def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

def format_currency(amount, currency="USD"):
    """Format a number as currency."""
    symbols = {"USD": "$", "EUR": "€", "GBP": "£"}
    symbol = symbols.get(currency, "$")
    return f"{symbol}{amount:.2f}"
```

### Step 2: Test Your Function
```python
# In a cell
from [PACKAGE_NAME].utils import calculate_average, format_currency

# Test your functions
print(calculate_average([1, 2, 3, 4, 5]))
print(format_currency(123.45))
```

### Step 3: Share with Everyone

Use the collaborative workflow to push your changes!

💡 **Tip**: Run `conda list` regularly to see what packages are installed in your environment. If you install something new with `pip install package_name`, consider adding it to your `environment.yml` for others to use.

## Understanding the Collaborative Workflow

What you just practiced is the foundation of how software teams work together. Teams use environments to manage what packages they have access to when developing. They organize code in packages that are easy to import and use.They track changes and manage collaborative workflows using Git.

This workflow scales from small academic projects to massive open-source libraries used by millions of developers.
