# Cues
**A CLI-first productivity tool for developers**

Visit the [website](https://cues-web.vercel.app).

## Project Overview

**Cues** is a multi-platform task and project management platform aimed at making task management for your projects as simple and easy as possible, with a CLI to access your tasks right from your terminal, while also providing a web UI for users who prefer a visual dashboard view.

### Problem
There are many existing platforms that provide excellent features to manage projects and tasks effectively (some including `Linear`, `Todoist`, etc.). However, one issue I personally faced, despite wanting to use such a platform, was that it would become a hassle to constantly switch between the terminal and the browser to develop software and creating/marking off tasks.

In order to solve this, I thought of developing a similar task and project management platform, except it comes with a **CLI** to enhance the productivity flow of developers who live in their terminal.

## Manual Setup
If you want to host the website manually, first clone the repo:
```bash
git clone https://github.com/aether-flux/cues-web
cd cues-web
```

Then, add a `.env` file and add the following variables:
```env
# Required to connect to the backend
NEXT_PUBLIC_BASE_URL="https://cues-backend-production.up.railway.app/api"
```

Then, run or deploy the project as you would any other Next.js project.
```bash
npm install
npm run dev
```

## Interested?
- Check out the repository for [Cues CLI](https://github.com/aether-flux/cues-cli) or visit the [web](https://cues-web.vercel.app) to view the CLI installation instructions.
- Visit the [website](https://cues-web.vercel.app) to explore the web interface of **Cues** with a dashboard-style task and project management UI.
- Check out the [backend repository](https://github.com/aether-flux/cues-backend) if you want to take a look at the internals.

## Support
If you liked the project and it turned out actually useful for you, consider supporting me at:
[![buymeacoffee-badge](https://img.shields.io/badge/aetherflux-ffdd00?style=for-the-badge&logo=buymeacoffee&logoColor=1a1a1a)](https://buymeacoffee.com/aetherflux).

## License
This project is licensed under **MIT**.

