## **BASH Command Line Cheat Sheet**

### **Basic Navigation**
| Instruction                       | Command                    |
|----------------------------------------|----------------------------|
| Show current directory            | `pwd`                      |
| List files in current directory   | `ls`                       |
| List all files (including hidden) | `ls -a`                    |
| List files with details and human-readable sizes | `ls -lh`|
| Change directory                  | `cd directory_name`        |
| Go up one directory               | `cd ..`                    |
| Go to home directory              | `cd ~`                     |
| Go to previous directory          | `cd -`                     |

### **File and Directory Management**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Create a new directory            | `mkdir directory_name`     |
| Create nested directories         | `mkdir -p path/to/dir`     |
| Create an empty file              | `touch file_name`          |
| Remove a file                     | `rm file_name`             |
| Remove a directory                | `rm -r directory_name`     |
| Copy a file                       | `cp source_file dest_file` |
| Copy a directory recursively      | `cp -r source_dir dest_dir`|
| Move or rename a file             | `mv old_name new_name`     |

### **Wildcards**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Match any characters              | `ls *.txt`                 |
| Match single character            | `ls file?.txt`             |
| Remove all .tmp files             | `rm *.tmp`                 |
| Copy all CSV files                | `cp *.csv backup/`         |

### **File Viewing & Editing**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Display file contents             | `cat file_name`            |
| View file with scrolling (q to quit) | `less file_name`       |
| Display first n lines of a file   | `head -n 5 file_name`      |
| Display last n lines of a file    | `tail -n 5 file_name`      |
| Count lines in file               | `wc -l file_name`          |
| Count lines in multiple files     | `wc -l *.txt`              |
| Open a file in text editor        | `nano file_name`           |

### **Search & Find**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Find files by name                | `find . -name "*.csv"`     |
| Find files in specific directory  | `find /path -name "*.log"` |
| Search for text in file           | `grep "pattern" file_name` |
| Case-insensitive search           | `grep -i "pattern" file`   |
| Search with line numbers          | `grep -n "pattern" file`   |
| Search with both -i and -n        | `grep -in "error" *.log`   |

### **Text Replacement with sed**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Preview replacement (prints to screen) | `sed 's/old/new/g' file.txt` |
| Replace in file (Linux)           | `sed -i 's/old/new/g' file.txt` |
| Replace in file (macOS)           | `sed -i '' 's/old/new/g' file.txt` |
| Replace http with https           | `sed 's/http:/https:/g' file` |

### **Redirection & Pipes**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Redirect output to file (overwrite) | `command > file_name`   |
| Append output to file             | `command >> file_name`     |
| Pipe output to next command       | `command1 \| command2`     |
| Count results from find           | `find . -name "*.txt" \| wc -l` |
| Pass file list to command         | `find . -name "*.log" \| xargs grep "ERROR"` |

### **Using xargs**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Pass filenames as arguments       | `find . -name "*.txt" \| xargs grep "word"` |
| Delete found files                | `find . -name "*.tmp" \| xargs rm` |
| Count lines in found files        | `find . -name "*.csv" \| xargs wc -l` |

### **Scripts & Permissions**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Make file executable              | `chmod +x script.sh`       |
| Run a script                      | `./script.sh`              |
| Read user input in script         | `read -p "Enter name: " name` |
| Use shebang for bash              | `#!/usr/bin/env bash`      |

### **Handling Spaces in Filenames**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Use quotes for spaces             | `cat "my file.txt"`        |
| Find files with spaces            | `find . -name "* *"`       |
| Rename spaces to underscores      | `mv "my file.txt" my_file.txt` |

### **System Information**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Show current username             | `whoami`                   |
| Show current shell                | `ps`                       |
| Show command history              | `history`                  |

### **Keyboard Shortcuts**
| Instruction                       | Shortcut                   |
|-----------------------------------|----------------------------|
| Stop current command              | `Ctrl + C`                 |
| Clear terminal screen             | `Ctrl + L` or `clear`      |
| Go to beginning of line           | `Ctrl + A`                 |
| Go to end of line                 | `Ctrl + E`                 |
| Autocomplete file/command         | `Tab`                      |
| Previous commands                 | `↑` / `↓` arrow keys       |

### **Combining Commands**
| Instruction                       | Command                    |
|-----------------------------------|----------------------------|
| Run if first succeeds             | `command1 && command2`     |
| Run regardless                    | `command1 ; command2`      |
| Create backup of logs             | `mkdir backup && cp *.log backup/` |
| Find errors and save report       | `grep -in "error" *.log > report.txt` |