---
title: "Getting Started"
description: "Learn how to use Cues for developer task management"
order: 1
---

# Welcome to Cues

Cues is a developer-focused task management system that combines the power of command-line tools with a clean, vintage-inspired web interface.

## What is Cues?

Cues helps developers organize their projects and tasks with:

- **CLI-first approach** - Manage tasks from your terminal
- **Project organization** - Group tasks by project
- **Priority management** - Set task priorities and due dates
- **Clean interface** - Vintage terminal aesthetic

## Quick Start

### Installation

Install the Cues CLI globally:

```bash
npm install -g @cues/cli
```

### Authentication

Get your authentication token from the web interface and authenticate:

```bash
cues login
```

### Create Your First Project

```bash
cues new project "my-awesome-project"
```

### Set an Active Project or CWP (Current Working Project)

```bash
cues use 48
```

### Add Tasks

```bash
cues add "Fix the login bug" --priority high
```

## Core Concepts

### Projects

Projects are containers for related tasks. Each project has:

- Unique identifier (*id*)
- Task collection
- Progress tracking

### Tasks

Tasks represent individual work items with:

- **Title** - Brief description of the work
- **Description** - Detailed information
- **Priority** - Low, Medium, High, or NA
- **Due Date** - When the task should be completed
- **Status** - Todo or Done

### Priority System

Use priority levels to organize your work:

- `@high` - Urgent tasks that need immediate attention (CLI: `-p high`)
- `@medium` - Standard priority tasks (CLI: `-p medium`)
- `@low` - Nice-to-have tasks (CLI: `-p low`)
- `@NA` - Tasks without specific priority (CLI: `no -p flag passed`)

## Web Interface

Access the web interface to:

- View tasks in a visual kanban board
- Create and edit tasks with a rich form
- Switch between projects quickly (⌘K)
- Manage project settings

## CLI Commands

### Project Management

```bash
# List all projects
cues projects

# Create new project
cues new project "New Project"

# Switch to a project
cues use 55

# Check Current Working Project (any one of the below)
cues current
cues active
cues cwp
```

### Task Management

```bash
# List tasks in current project
cues tasks

# Create a new task
cues add "Task title" --priority medium

# Mark task as done
cues done <task-id>

# Edit task
cues edit <task-id> --title "New title"
```

### Authentication

```bash
# Login with token
cues login

# Check current user
cues  whoami

# Logout
cues logout
```

## Configuration

Cues stores configuration in `~/.cues/config.json`:

```json
{
  "currentProject": "Current Project Name",
  "currentProjectId": 55,
  "expiresAt": "2025-12-31T03:38:15.278258856+05:30"
}
```

## Tips & Tricks

> **Pro Tip**: Use the ⌘K shortcut in the web interface to quickly switch between projects.

### Workflow Integration

Integrate Cues into your development workflow:

1. **Morning Planning** - Review tasks for the day
2. **Feature Development** - Create tasks for each feature
3. **Bug Tracking** - Add bugs as high-priority tasks
4. **Code Review** - Track review tasks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K | Open project switcher |
| ESC | Close modals |
|----------|--------|

Ready to get started? [Look at the CLI](/docs/cues-cli) or explore the web interface!

