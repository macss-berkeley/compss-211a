# Git Collaborative Workflows <br>

Now that you've mastered the personal workflow, let's explore how Git enables collaboration between multiple developers. In collaborative workflows, multiple people may be working on the same repository at the same time, so we need systems to manage changes and prevent conflicts.<br>

## Branching: The Foundation of Collaboration

Recall that collaborative workflows heavily rely on **branching**. A branch in Git is a separate line of development within a repository. It allows you to work on new features, bug fixes, or experiments without affecting the main codebase.<br> 

Think of branches like parallel universes of your code - you can make changes in one branch while keeping the main branch stable and functional.

### Branches vs. Forks
Before we dive into the workflow, let's remember two similar concepts:

* **Branches** are within the same repository. They make collaboration easier among team members who have write access to the repository.
* **Forks** create a completely separate copy of the repository in your GitHub account. This is useful for outside contributors who don't have write access to the original repository.

<br><img src="../../img/collaborative.png" alt="collaborative workflow" width="50%">

## The Collaborative Workflow Process

The typical collaborative workflow follows these steps:

### 1. **Fork the Repository** 
When contributing to someone else's project, start by **forking** the repository. This creates a copy of the repository in your own GitHub account, giving you full control to make changes without affecting the original.

🥊**Challenge**: Fork the [`Git-Playground`](https://github.com/dlab-berkeley/Git-Playground) repository. Look for the "Fork" button in the top-right corner:<br>
<img src="../../img/fork.png" alt="forking" width="50%"><br>

### 2. **Clone Your Fork** 
Clone your forked repository to your local machine:
```bash
git clone [Link-to-your-forked-repo]
cd Git-Playground
```

### 3. **Create and Switch to a New Branch** 
Create a new branch for your feature or fix. This keeps your changes separate from the main branch:
```bash
git branch feature-name          # Create new branch
git checkout feature-name        # Switch to new branch
# OR combine both steps:
git checkout -b feature-name     # Create and switch in one command
```

💡 **Tip**: Use descriptive branch names like `fix-login-bug` or `add-user-profile` instead of generic names like `feature1`.<br>

To see all branches and which one you're currently on:
```bash
git branch                       # Shows local branches (* marks current)
git branch -a                   # Shows both local and remote branches
```
 
### 4. **Make Your Changes** 
Now you can safely make changes in your feature branch:
```bash
# Create a new file or edit existing ones
echo "Hello from my feature branch!" > my-contribution.txt

# Stage and commit your changes
git add my-contribution.txt
git commit -m "Add my contribution to the project"
```

🥊 **Challenge**: Create a new file with some text, stage it, and commit it.<br>

### 5. **Push Your Branch** 
Push your feature branch to your forked repository on GitHub:
```bash
git push origin feature-name
```

🥊 **Challenge**: Push the change on this branch to your remote repo. <br>

### 6. **Create a Pull Request** 
Now comes the magic of collaboration! A **Pull Request** (PR) is a request to merge your changes from your feature branch into the original repository's main branch.

**What makes Pull Requests powerful:**
- Code review: Others can examine your changes before they're merged
- Discussion: Team members can comment and suggest improvements
- Testing: Automated tests can run on your changes
- Documentation: You can explain what your changes do and why

**Creating the Pull Request:**
1. Go to your forked `Git-Playground` repository on GitHub
2. GitHub will likely show a banner suggesting you create a pull request
3. Click `Compare & pull request` or navigate to "Pull requests" → "New pull request"
4. Write a clear title and description of your changes
5. Click "Create pull request"

🥊 **Challenge**: Create a pull request from your feature branch to the original repository.<br>

The process of merging changes this way allows multiple people to work in parallel without directly modifying the main branch. Combined with GitHub's platform for handling PRs, you have a powerful system for collaborative development.<br>

## Handling Merge Conflicts

Sometimes, when multiple people work on the same files, Git can't automatically merge the changes. This creates a **merge conflict** that needs to be resolved manually.

### When Do Conflicts Occur?
- Two people edit the same lines in a file
- One person deletes a file while another person edits it
- Changes are made to the same part of the codebase

### Resolving Conflicts
When you encounter a conflict, Git will mark the conflicting sections in your files:
```
<<<<<<< HEAD
Your changes
=======
Other person's changes
>>>>>>> branch-name
```

To resolve:
1. Edit the file to choose which changes to keep
2. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Stage and commit the resolved file

🎬 **Demo**: We will demonstrate merge conflicts and how to resolve them.

## Advanced Collaborative Techniques

### Keeping Your Fork Updated
Over time, the original repository will have new commits. To keep your fork updated:
```bash
# Add the original repo as a remote (do this once)
git remote add upstream https://github.com/original-owner/repo-name.git

# Fetch and merge updates from the original repo
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Branch Management
```bash
# Delete a branch locally (after it's merged)
git branch -d branch-name

# Delete a branch on GitHub
git push origin --delete branch-name
```

# Repository Management<br>
 
## Removing Git Repositories

* **Local:** To remove git tracking from a directory, delete the `.git` folder in the root directory. Note that `.git` directories are hidden by default. To delete everything (code and git history), simply delete the entire project directory.<br>
 
* **Remote:** To delete a remote repository on GitHub, go to the repository Settings → scroll to "Danger Zone" → "Delete this repository". ⚠️ **Warning**: This action cannot be undone!<br>

# Discussion

- What Git workflow will your team use?
- How will you handle merge conflicts when multiple people are working on the same dataset?
- What's your plan when someone accidentally commits a 2GB dataset file?

 
# Key Takeaways

## Git Workflow Progression
Understanding Git workflows helps you choose the right approach for different situations:

1. **Personal Workflow** (covered in Git Basics): Working solo on your own repositories
2. **Collaborative Workflow** (this lesson): Working with a team or contributing to others' projects
3. **Large-scale Open Source**: Contributing to major projects with hundreds of contributors (builds on collaborative principles)

## Essential Collaboration Concepts
- **Branching**: Create parallel development lines for features and fixes
- **Forking**: Make your own copy of someone else's repository
- **Pull Requests**: Propose and discuss changes before merging
- **Merge Conflicts**: Handle situations where changes overlap
- **Code Review**: Collaborate through discussion and feedback

## Best Practices
- Use descriptive branch names and commit messages
- Keep pull requests focused and manageable
- Regularly sync your fork with the original repository
- Test your changes before creating pull requests
- Be responsive to feedback during code review

The collaborative workflow forms the foundation for most professional software development and open-source contribution.<br>
