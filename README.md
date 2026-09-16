# BearAI

BearAI is Baylor University’s student organization for artificial intelligence, machine learning, and emerging AI technologies. Students from all majors and experience levels are welcome.

**Website:** [bearai-bu.github.io](https://bearai-bu.github.io/)
**Repository:** [BearAI-BU/bearai-bu.github.io](https://github.com/BearAI-BU/bearai-bu.github.io)

The site introduces the club and its officers, shares events and community photos, offers learning resources, celebrates recognition, and connects students with club channels and the interest survey. Individual affiliations on Connections do not imply institutional sponsorship.

## Preview locally

Install Git and Node.js 22 or newer (Node includes npm), then run:

```sh
git clone https://github.com/BearAI-BU/bearai-bu.github.io.git
cd bearai-bu.github.io
npm start
```

Open **http://127.0.0.1:4173/**. Keep the terminal running; press Ctrl+C to stop. If port 4173 is busy, stop the other preview first. No dependency installation is needed: the tools use Node’s built-in modules. Save edits and refresh your browser.

This is a static HTML/CSS/JavaScript site. URLs such as `#/people` are intentional: hash navigation works on GitHub Pages without server redirects.

## Project guide

| File or folder | Purpose |
| --- | --- |
| `content.js` | People, events, photos, recognition, connections, joining links, and section visibility |
| `resources.js` | Learning categories, descriptions, courses, and links |
| `app.js` | Page templates and wording, including the survey description and Connections source note |
| `assets/` | Public photos, flyers, logos, and the constitution PDF |
| `styles.css` | Layout, colors, portrait framing, and responsive presentation |
| `events.js` | Event classification and next-event selection |
| `trace.js`, `visuals.js` | Symmetric bear network and accessible animations |
| `scripts/`, `tests/` | Local preview, packaging, and checks |
| `.github/workflows/pages.yml` | Automatic GitHub Pages deployment |

## Updating content

### People and photos

In `content.js`, edit `officers`, `advisor`, `formerAdvisors`, or `pastOfficers`. Follow a neighboring record’s structure. Keep role and academic-program wording accurate; program labels have no trailing periods. Use semester and year, such as `Spring 2028`. `graduationYear` displays **Expected graduation**; `graduated` displays **Graduated**.

Put approved portraits in `assets/` and update `photo`. The optional `position` controls cropping, such as `50% 40%`. Lucas and Chelsey also have individual scaling in `officerCard()` in `app.js`; review it when changing those photos. Check faces on desktop and mobile without stretching images or generating faces. Existing former-officer photos are accepted; higher-resolution replacements are not required.

Use short filenames without spaces. Event photos have `src`, descriptive `alt`, and `caption` fields. Everything in this public repository, including document metadata, is public. Do not commit credentials, private notes, participant lists, unrelated attachments, or unapproved photos.

### Events and homepage selection

Edit `events` in `content.js`. Give each event a unique, stable `id`, title, description, location, approved links, and ISO start/end dates with explicit offsets, such as `2026-09-19T12:00:00-05:00`. Waco uses `-05:00` during daylight saving time and `-06:00` during standard time; confirm the offset for the event date.

Keep photos and recaps in the event record. `communityHighlights` chooses an event by `eventId` and a photo by zero-based `photoIndex`; its link opens the event recap.

`events.js` compares dates with the visitor’s current clock, excludes hidden and cancelled events, and sorts by start time. Home shows **one event: the earliest confirmed start time still in the future**. Ongoing and past events remain on Events. Undated events never displace confirmed future events. If nothing is upcoming, Home shows an undated placeholder when available, or an empty-state message.

The current ECS Tailgate flyer template in `app.js` includes its approved display date/time and flyer alt text explicitly. When changing that event, update those strings as well as its shared record. Adapt the template before adding a different flyer event so it does not inherit Tailgate wording. Keep reservation deadlines accurate and do not promise meals after reservations close.

### Learning resources

Edit categories and courses in `resources.js`. Check destination links and preserve helpful descriptions. `tests/check-revision5.cjs` locks the approved resource text using a fingerprint and length; after an intentional resource update, review the text and update those expectations. Do not bypass a failure without understanding it.

### Recognition

Edit `recognition` in `content.js`. Follow the existing record’s year, recipient, title, description, photo, and source-link format. Publish only confirmed achievements and approved photos.

### Connections

Edit `connections` in `content.js`. Keep affiliations and relationships accurate. Types group guest speakers, collaborations, former-officer destinations, and former-advisor destinations. Use `bearRole` to label former advisors and `website` for an optional profile link. Only `verified: true` records appear; this is an editorial visibility flag, not automated verification.

Use authentic logos without distortion and select an appropriate backing with `logoDark`. New records can use `logo: "assets/example.svg"`. Some existing SVGs are embedded as data URLs in `logo`, with their original path in `logoAsset`; changing only that file will not update the embedded image. Update the displayed source note in `app.js` only after leadership actually checks the information. Do not automatically advance its date.

## Check and build

```sh
npm test
npm run build
```

Checks cover JavaScript syntax, event selection, symmetric bear geometry, reduced-motion behavior, entrance cleanup, and referenced content assets. Some tests assert approved content; deliberately update those assertions when the content changes. Also review affected pages at desktop and mobile widths.

No compilation or third-party build dependencies are required. The build copies an explicit list of public website files into `dist/`, excluding documentation, scripts, tests, and local private files. Do not edit or commit `dist/`.

## Deploy updates

Check your author identity and review files before committing:

```sh
git config user.name
git config user.email
git status
git diff
```

Use an email verified on your GitHub account, or the exact noreply address shown in GitHub’s email settings. If needed, set repository-specific identity with `git config user.name "Your name"` and `git config user.email "Your verified email"`.

Commit only reviewed files and push to `main`, or use a pull request when collaborating:

```sh
git add <files-you-reviewed>
git commit -m "Update BearAI website"
git push origin main
```

Preserve repository history; never force-push over another officer’s work.

In GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included workflow checks, builds, and deploys each push to `main`. It can also be started from **Actions → Deploy BearAI to GitHub Pages → Run workflow**. This public repository uses free GitHub Pages and the default `github.io` address; no paid hosting or custom domain is needed.

Wait for the workflow to succeed, then visit [the website](https://bearai-bu.github.io/) and check images, navigation, and interior pages. If a step fails, read its Actions log, fix it locally, and push a follow-up commit. Failed checks prevent deployment.
