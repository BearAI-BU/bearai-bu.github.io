# BearAI website

BearAI is Baylor University’s student organization for artificial intelligence, machine learning, and emerging AI technologies. The website welcomes students from every major, introduces officers and advisors, lists events, shares learning resources and community photos, celebrates achievements, and links to club channels.

**Live site:** https://bearai-bu.github.io/

**Repository:** https://github.com/BearAI-BU/bearai-bu.github.io

## Contents

1. [Quick start](#quick-start)
2. [How it works](#how-it-works)
3. [Project structure](#project-structure)
4. [Access, setup, and routine content maintenance](docs/maintenance.md)
5. [Complete event walkthrough and example](docs/events.md)
6. [Publishing, troubleshooting, recovery, and handoff](docs/publishing.md)

These guides are for any officer or contributor. They require no AI, prior conversation, or access to the original maintainer’s computer.

## Quick start

1. Install [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/) version 22 or newer. Node includes npm. A text editor such as Visual Studio Code is useful but optional.
2. Open PowerShell on Windows or Terminal on macOS/Linux and run:

```sh
git clone https://github.com/BearAI-BU/bearai-bu.github.io.git
cd bearai-bu.github.io
npm start
```

3. Open **http://127.0.0.1:4173/**. This means your own computer; editing this copy does not change the public site. Save edits and refresh the browser. Stop the server with **Ctrl+C**.
4. In a second terminal in the same folder, or after stopping the server, run:

```sh
npm test
npm run build
```

No dependency installation is needed: this project uses Node’s built-in modules. Do not run `npm install` as a required setup step. Commands are the same on Windows, macOS, and Linux. If Windows PowerShell blocks `npm.ps1`, use `npm.cmd start`, `npm.cmd test`, and `npm.cmd run build`, or use Command Prompt; do not disable execution-policy protections.

## How it works

The site uses plain **HTML** (page structure), **CSS** (appearance), and **JavaScript** (content, navigation, dates, and animation). There is no database, login system, framework, or compilation dependency. Addresses like `#/people` select pages inside `index.html`; this works on GitHub Pages without server redirects.

A **repository** is the files plus their recorded history. A **branch** is a separate line of work. A **commit** is a named snapshot of changes. A **push** sends local commits to GitHub. A **build** packages public files into `dist/`. **Deployment** puts that package on the public hosting service.

Local edits affect only your computer. A commit saves local history. Pushing a branch updates GitHub; pushing or merging into **main** triggers the deployment workflow. The live site changes after that workflow succeeds. This public repository uses free GitHub Pages with the default `github.io` address.

## Project structure

| Path | Purpose |
| --- | --- |
| `content.js` | Officers, advisors, events, joining links, photos, recognition, connections, and section visibility |
| `resources.js` | Learning categories and courses |
| `app.js` | Page templates, navigation (`routes`), survey wording, and source-review note |
| `styles.css` | Layout, colors, portrait framing, responsive styles, and entrance effects |
| `index.html` | Page shell, metadata, logo references, and loaded scripts |
| `events.js` | Date classification and next-event selection |
| `trace.js`, `visuals.js` | Bear shape, symmetric network, signals, reduced-motion behavior |
| `assets/` | Public images, logos, flyers, and constitution PDF |
| `docs/` | Maintainer instructions |
| `scripts/preview.cjs` | Local server, bound to 127.0.0.1 on port 4173 |
| `scripts/check.cjs`, `tests/` | Automated checks |
| `scripts/build.cjs` | Explicit list of files copied to `dist/` |
| `.github/workflows/pages.yml` | Checks, build, and deployment on main |
| `dist/` | Generated output: do not edit or commit |

Keep source files at the repository root. The build publishes only selected website files and `assets/`. Documentation and development tools stay out of the hosted package, but the repository itself is public. Never commit credentials or private member data anywhere in it.

Continue with [content maintenance](docs/maintenance.md), [event management](docs/events.md), and [publishing and recovery](docs/publishing.md).
