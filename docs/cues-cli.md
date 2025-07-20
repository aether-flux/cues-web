---
title: "CLI Reference"
description: "Complete command reference for the Cues CLI"
order: 2
---

# CLI Reference

The Cues CLI provides powerful command-line tools for managing your tasks and projects.

## Installation

```bash
npm install -g @cues/cli
```

## Global Options

All commands support these global options:

- `--help, -h` - Show help information
- `--version, -V` - Show version number

## Authentication Commands

### `cues login`
Log in to your *Cues* account in the CLI.

```bash
cues login
```

### `cues logout`
Log out from any account logged in locally.

```bash
cues logout
```

### `cues whoami`
Display information about currently logged in user.

```bash
cues whoami
```

## Project Commands

### `cues projects`
List all projects of the logged in user, with *project id* and *name*.

```bash
cues projects
```

### `cues use`
Selects a project to be used as default project locally.

```bash
cues use <id>
```

#### Example:
```bash
# Will set the currently active project as the project with id 2
cues use 2
```

### `cues cwp` / `cues active` / `cues current`
Display the project currently set as active project.

> **CWP**: Current Working Project

```bash
cues cwp
```

If it's confusing to use `cwp`, you can also use:
```bash
cues active
```
Or
```bash
cues current
```

### `cues new`
Create a new project.

```bash
cues new project <name>
```

#### Example:
```bash
cues new project "Learning JS"
```

## Task Commands

### `cues tasks`
Lists all available tasks, with its *id*, *title*, *description*, *priority*, *due date* and *todo progress (done/not done)*.

By default, displays tasks in the **CWP** (Current Working Project).

#### Options
- `--all, -a` - Displays all tasks, grouped by projects

#### Example
To list tasks in CWP:
```bash
cues tasks
```

To list all tasks, grouped by project:
```bash
cues tasks --all
```

### `cues add`
Add a new task.

#### Options
- `--desc, -d` - Task description (optional)
- `--priority, -p` - Task priority, high/medium/low (optional)
- `--due, -u` - Due date and time of completion (optional)

The `--due` flag can be passed in any of the following formats:
- `--due "today 18:00"` - Due by today, 6pm
- `--due "tomorrow 4:00"` - Due by tomorrow, 4am
- `--due "thursday 17:30"` - Due by upcoming Thursday, 5:30pm
- `--due "20/08/2025 9:15"` - Due by 20th August, 2025, 9:15am

#### Example
To create a task with no optional fields:
```bash
cues add "Task Name"
```

To add any field, specify the flag and then the corresponding value:
```bash
cues add "DOM Manipulation" -d "Learn about basics of DOM Manipulation" -p medium -u "today 18:00"
```

### `cues done`
Mark any task as done.

```bash
cues done <id>
```

#### Example:
To mark task with id *14* as done:
```bash
cues done 14
```

> You can get the id of a task using the `cues tasks` command.

### `cues edit`
Edit the contents of a task.

#### Options
- `--title, -t` - Task title (optional)
- `--desc, -d` - Task description (optional)
- `--priority, -p` - Task priority, high/medium/low (optional)
- `--due, -u` - Due date and time of completion (optional)

#### Example:
You may pass any combination of the flags that you may want to edit. For example, if you want to edit just the task title:
```bash
cues edit <id> -t "New title"
```

Or if you wish to edit the priority and due date:
```bash
cues edit <id> -p low -u "tomorrow 17:30"
```

### `cues delete`
Delete a task.

```bash
cues delete <id>
```

#### Example:
To delete the task with id *14*:
```bash
cues delete 14
```

## Examples

### Daily Workflow

```bash
# Morning: Check today's tasks
cues tasks

# Create a new task
cues add "Review PR #42" --priority medium --due "today 10:00"

# Mark completed tasks as done
cues done 123
```

### Project Setup

```bash
# Create new project
cues new project "Mobile App Redesign"

# Suppose the new project created has id 54

# Switch to project
cues use 54

# Add initial tasks
cues add "Design wireframes" --priority high
cues add "Set up React Native project" --priority high
cues add "Configure CI/CD" --priority medium
```

