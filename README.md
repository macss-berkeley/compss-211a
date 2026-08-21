# COMPSS-211A

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

This repository contains the materials for COMPSS 211A: Computing I, a hands-on course in computational social science. The course develops practical skills for collecting, managing, analyzing, and communicating social and textual data, with an emphasis on reproducible workflows and responsible use of AI.

Key topics include:

* Python and Pandas: Working with core Python objects, functions, tabular data, debugging, and reproducible data analysis.
* Version Control and Local Computing: Using Git and GitHub for version control and collaboration, and the command line for navigating files, running scripts, and managing computing workflows.
* Structured Data and Web APIs: Working with CSV, TSV, JSON, and XML; acquiring data through APIs; and handling authentication, pagination, rate limits, privacy, and data-quality limitations.
* Natural Language Processing: Cleaning and tokenizing text, constructing bag-of-words and TF-IDF representations, creating lightweight document embeddings, and using clustering and classification methods while critically evaluating interpretation and bias.
* LLMs and Agentic Workflows: Using large language models and AI coding tools for bounded research and programming tasks, while validating structured outputs, debugging generated code, protecting credentials, tracking costs, and documenting limitations.
* Cloud Computing: Using hosted environments and APIs, including Google Colab and Gemini, to run models and build reproducible cloud-based workflows.

Throughout the course, students apply these methods to computational social science problems using real and synthetic datasets. The course culminates in a team-based project in which students formulate a social science question, work with a textual dataset, conduct a reproducible analysis, interpret their findings, and communicate the results through code, a written report, and a presentation.

A central theme of the course is responsible computing in the age of AI: students are expected to understand and verify their code and model outputs, document AI assistance, protect sensitive information and credentials, and remain accountable for every result they submit.

# Local Setup
Anaconda is a useful package management software that allows you to run Python and Jupyter notebooks easily. Installing Anaconda allows you to run the materials for this workshop on your local machine. If you would like to run Python on your own computer, complete the following steps prior to the workshop:

1. [Download and install Anaconda](https://www.anaconda.com/products/individual). Click the "Download" button.

2. Download the workshop materials (this repo):

   -   Click the green "Code" button in the top right of the repository information.
   -   Click "Download Zip".
   -   Extract this file to a folder on your computer where you can easily access it (we recommend Desktop).

3. Optional: if you're familiar with `git`, you can instead clone this repository by opening a terminal and entering the command `git clone
   git@github.com:macss-berkeley/compss-211a.git`.

# Google Colab Setup

Google Colab lets you open and run course notebooks in a web browser without installing Python locally.

## To launch a notebook:

1. Go to [Google Colab](https://colab.research.google.com/).
2. Select **File → Open notebook**, then choose the **GitHub** tab.
3. Enter the URL of this repository and select the notebook you want to open.
4. Select **File → Save a copy in Drive** before making changes. The repository copy is read-only and your Colab runtime is temporary.

When an assignment is complete, restart the runtime, run every cell from top to bottom, save the notebook, and download the finished `.ipynb` file for submission through bCourses.

Some lessons teach Git, the command line, or local package management and therefore still require the local setup described above. Assignment instructions will state when local work is required.

# Contributors

-  [Tom van Nuenen](https://github.com/tomvannuenen)
-  [Pratik Sachdeva](https://github.com/pssachdeva)
-  [Arul Murugan Renganathan](arul@berkeley.edu)
