# Lab: Practical Bash for Computational Social Science

**Goal:** Learn essential command line skills for navigating, inspecting, and manipulating files efficiently.

**Setup:**
- Your terminal (Mac/Linux, or WSL on Windows)
- The provided `bash_lab/` folder containing:
  - `data/` (CSV and JSON files)
  - `logs/` (log files with various messages)
  - `docs/` (markdown documentation files)

## Core Tasks

### Part 1: Basic Navigation
1. Print your current directory path
2. Navigate to the `bash_lab` folder
3. List all files and folders
4. List files in `data/` with file sizes

### Part 2: File Inspection
5. Display the first 5 lines of any CSV file in `data/`
6. Display the last 5 lines of any log file in `logs/`
7. Count the number of lines in `data/sample.csv`
8. Count how many CSV files are in the `data/` folder

### Part 3: Basic Searching
9. Search for the word "ERROR" in any log file
10. Count how many times "ERROR" appears in `logs/app_2024.log`
11. Find all JSON files in the `data/` folder
12. Display all markdown files in the `docs/` folder

### Part 4: Simple File Operations
13. Create a new directory called `backup`
14. Copy one CSV file to the `backup` folder
15. Create a text file listing all CSV filenames in `data/`

## Stretch Goals

### Advanced Searching
- Find all lines containing "ERROR" (case-insensitive) across ALL log files
- Search for "ERROR" and show line numbers
- Find lines that contain both "ERROR" and "2024"

### File Manipulation
- Count total lines across all CSV files combined
- Find all files with spaces in their names
- Rename files with spaces to use underscores (test with echo first!)
- Replace all instances of `http:` with `https:` in markdown files

### Automation
- Create a bash script that counts lines in each CSV file
- Use `xargs` to process multiple files at once
- Write a one-liner that finds the largest CSV file by line count
- Create a script that generates a summary report of all log errors

## Deliverables
Submit a text file `lab_commands.txt` containing:
- The commands you used for each core task
- Brief comments explaining what each command does
- Any stretch goals you completed
