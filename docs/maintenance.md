# Maintainer setup and content guide

[README](../README.md) · [Events](events.md) · [Publishing and recovery](publishing.md)

## Contents

1. [Access and first setup](#access-and-first-setup)
2. [Content syntax](#content-syntax)
3. [People and advisors](#people-and-advisors)
4. [Photos and documents](#photos-and-documents)
5. [Resources and recognition](#resources-and-recognition)
6. [Connections](#connections)
7. [Joining links and navigation](#joining-links-and-navigation)

## Access and first setup

1. Create your own GitHub account and enable two-factor authentication. Ask a current BearAI organization owner for an invitation to the organization and the appropriate team or repository access. Accept the invitation. Never share accounts or passwords.
2. Anyone may read or clone this public repository. To publish, you need write access, or a contributor branch/fork and a pull request approved by someone who has access. A **pull request** asks maintainers to review and merge changes. Organization membership alone does not necessarily grant editing rights.
3. Install Git and Node.js 22 or newer from their official sites linked in the README, and a text editor. Reopen your terminal after installation. Run `git --version`, `node --version`, and `npm --version` to verify them. On Linux, ensure the distribution’s package provides a sufficiently recent Node version. macOS may prompt for command-line tools when Git is first run.
4. Follow [Quick start](../README.md#quick-start) to clone and run the site. No third-party dependencies or `npm install` are required. Use PowerShell/Command Prompt on Windows and Terminal on macOS/Linux. All commands below run inside the cloned repository folder; quote any path containing spaces.
5. Configure commit identity for this repository:

```sh
git config user.name "Your GitHub name"
git config user.email "YOUR-EXACT-GITHUB-NOREPLY-ADDRESS"
git config user.name
git config user.email
```

Replace both placeholders. In GitHub **Settings → Emails**, find your exact GitHub-provided noreply address if you prefer not to publish a personal email. Do not guess it. You may instead use an email verified on your account. These commands omit `--global`, so they affect only this repository. Commit identity attributes work; it does not sign you in or grant permission.

6. Before each editing session, start with a clean working tree (`git status`) and get teammates’ changes:

```sh
git switch main
git pull --ff-only origin main
git switch -c update-september-events
```

Choose a new descriptive branch name each time. If you already have unfinished edits, save/commit them on their branch before switching; do not discard them to make a command work. If `--ff-only` fails, consult the conflict guidance rather than force-pushing.

## Content syntax

`content.js` begins `window.BEARAI = {` and ends `};`. `resources.js` assigns a list to `window.BEAR_RESOURCES`. These are JavaScript files containing JSON-style data: objects use `{}`, lists use `[]`, text uses double quotes, and neighboring fields/records need commas. Values `true`, `false`, and `null` have no quotes.

For example: `"location": "Cashion C311"`. A literal quote inside text must be escaped: `"description": "Bring your \"what if\" questions."`. Keep ordinary ASCII quote characters around values; a curly apostrophe inside a sentence is fine. Do not paste an entire second `window.BEARAI` assignment when adding one record. Do not remove other records accidentally. Run `npm test` to catch syntax mistakes.

Missing information should remain absent, `null`, or the existing useful empty state. Do not invent names, dates, biographies, links, or partnerships. Only enable an optional section flag in `content.js` → `sections` when you have content ready. Most content text is escaped by the template; write plain text instead of HTML in data fields.

## People and advisors

1. Find `officers` in `content.js`. Add/edit a record following this illustrative format (replace all example values with confirmed information):

```json
{
  "name": "Approved public name",
  "role": "Secretary",
  "major": "Computer Science (Software Engineering concentration)",
  "graduationYear": "Spring 2028",
  "photo": "assets/approved-portrait.jpg",
  "position": "50% 30%"
}
```

2. Use no trailing period for the academic program. Current officers use `graduationYear`, labeled **Expected graduation**. Use semester/year consistently. If unknown, omit it; the template says “To be added.” Do not infer dates from the person’s year in school.
3. When moving an officer to `pastOfficers`, remove the current record and add its verified historical record there. Use `graduated` only for an actual confirmed graduation date, not an expected date. Former-officer role labeling currently relies on `graduated`; if a former officer has not graduated, the template needs an explicit status field before representing that case accurately. Do not manufacture a graduation date to get the label.
4. `advisor` is the current advisor object. `formerAdvisors` is a list. Advisor records accept `name`, `role`, `photo`, optional `position`, `bio`, `facultyProfile`, and `website`. A former advisor’s role should explicitly say `Former Faculty Advisor`. Move an advisor’s record rather than labeling them a former student officer.
5. Public name, program, graduation, and portrait are separate fields. Changing a name should not erase the others. Review the People page after changes.

## Photos and documents

1. Put approved files in `assets/`, using lowercase hyphenated filenames, such as `september-meeting.jpg`. Paths are case-sensitive on the live site even if Windows tolerates a mismatch.
2. Prefer JPEG or WebP for photographs, PNG for graphics requiring crisp text/transparency, and authentic SVG for vector logos. The preview server supports these image types. Aim for 600–1000 pixels across for new portraits and 1200–1600 pixels for event images; a few hundred KB per photo and under about 1 MB where practical keeps loading quick. These are recommendations, not strict requirements. Do not enlarge low-resolution originals or alter faces. Preserve readable flyer text.
3. Officers use `photo`; promotional event artwork uses `image`, `imageAlt`, `imageCaption`; flyers use `flyer`, `flyerAlt`; actual gallery images use `photos` records. See [the full event example](events.md).
4. **Alternative text** describes an image for people who cannot see it. Describe what matters, rather than the filename. A **caption** is visible text beside/below the image. Do not infer identities or attendance.
5. Portrait `position` is CSS `object-position`: horizontal and vertical percentages, e.g. `50% 30%`. The frame uses cropping rather than stretching. Some portraits also have a `scale` setting in their `content.js` record; preserve it when changing a name, and review it when replacing the photo. Existing 100-pixel former-officer originals intentionally use smaller frames and do not require replacements.
6. For logos, use authentic files and `logoDark` when white artwork needs a dark neutral backing. Images fit without distortion. Some existing `logo` values are embedded data URLs; `logoAsset` documents the original file. Updating only that file will not change the embedded image: replace `logo` with the updated `assets/...` path or new embedded value.
7. To replace an image, add the new file, change its references, and check the page before removing the old file. Use the editor’s project-wide search for the old filename. For removal, clear the data reference too. A deleted file with an unchanged path produces a broken image.
8. The constitution path is `content.js` → `constitution`. Replace `assets/BearAI-Constitution.pdf` with the approved PDF, or add a renamed PDF and update that path. Open the About-page link to verify it.

Obtain permission to use photos and check for personal metadata, especially location data. Never upload private membership records, credentials, or unrelated attachments. The entire repository is public, not just the deployed pages.

## Resources and recognition

Resources live in `resources.js`. A category has `title`, `description`, and `courses`; each course has `title`, `url`, and `paragraphs`. A paragraph has `text` and optional `italic`:

```json
{
  "title": "Approved course title",
  "url": "https://example.org/course",
  "paragraphs": [{ "text": "What students will learn.", "italic": false }]
}
```

Replace the example URL with a working HTTPS course URL before publishing. Add this object inside the relevant `courses` list, not at the top level. To add a category, copy an existing category structure. Click each link and review descriptions. The resource test currently locks the approved copy. For an intentional resource edit, compute its new fingerprint/length with this command and update the two expected numbers in `tests/check-revision5.cjs` only after reviewing the text:

```sh
node -e "const fs=require('fs'),vm=require('vm'),c={window:{}};vm.runInNewContext(fs.readFileSync('resources.js','utf8'),c);const s=JSON.stringify(c.window.BEAR_RESOURCES);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);console.log(h>>>0,s.length)"
```

Recognition lives in `content.js` → `recognition`. Follow the existing record: `year`, `recipient`, `title`, `description`, `photo`, `url`, and `verified: true`. For example, a future confirmed award might use `"year": 2027`, an approved team name, the exact award title, an approved photo, and the competition’s source link. The existing recognition image alt text is specific to the 2025 competition in `app.js`; adapt that template to a per-record alt field when adding another award rather than repeating the old description. Do not infer winners or reuse an unrelated award photo.

## Connections

Add/edit `connections` in `content.js`. Example structure:

```json
{
  "name": "Approved speaker name",
  "affiliation": "Confirmed institution",
  "relationship": "Spoke with BearAI about the confirmed topic.",
  "type": "Guest speaker",
  "verified": true,
  "website": "https://example.org/profile"
}
```

Replace example facts/URL or omit unavailable fields. Without a logo the affiliation appears as text. Optional fields are `logo`, `logoDark`, and `bearRole`. Valid grouping types are exactly `Guest speaker`, `Collaboration`, `Alumni destination`, and `Former advisor destination`. A collaboration’s relationship should describe the actual shared activity; a destination should describe the person’s current confirmed work/study. Use `bearRole: "Former Faculty Advisor"` for former advisors. `verified` is an editorial visibility flag, not automated checking.

To update an alumni destination, edit `affiliation`, `relationship`, logo fields, and optional website together. Remove obsolete employer text and logo references. Update the visible source-review note in `connections()` in `app.js` only after leadership has checked the facts; preserve accurate sources/dates. Affiliations must not imply sponsorship of BearAI.

## Joining links and navigation

`content.js` → `join` contains `connect` (Baylor Connect), `groupme`, `instagram`, `survey`, and `email`. Change the appropriate value, then test the Join page. Email is an address without `mailto:`; the template adds it. Other links should be HTTPS. Explanatory wording, including the interest-survey description, is in `join()` in `app.js`. Leave unavailable links empty rather than inventing them; the existing template shows a disabled coming-soon button.

Navigation is the `routes` array near the top of `app.js`; page functions are mapped in `pages` near the bottom. Footer links are a separate template in the same file. To rename a label, change the label only, keeping the route stable. Adding an entirely new page requires a page function, a `pages` entry, and a `routes` entry, plus any desired footer link. This is optional development work, not necessary for normal data updates. Test desktop navigation, mobile Menu, Back, and direct `#/route` links.

### Semester plans and confirmation

Edit the same records in `content.js` → `events`; do not create a second copy for the table or homepage. Set `semester` to `Fall 2026`, `planOrder` to its row order, and `status` to `Tentative`. Use `proposedDate` (`YYYY-MM-DD`) for a proposed day without inventing a time; use `null` for an unknown date. Tentative events stay in the semester table and never move into Past Events automatically.

Only after approval, change `status` to `Confirmed` and enter the confirmed `start` and `end` with their correct time-zone offsets. Confirmed future events appear in Upcoming Events and take priority on the homepage; their semester row stays visible and says Confirmed. Without a confirmed upcoming event, the homepage keeps a tentative planned activity. A proposed date alone is not confirmation.

Keep `detailsPending: true` for a placeholder such as Workshop 1 until meaningful details are ready; this hides its gallery link. Add the original flyer under `flyer`. With photos, previews show that flyer first and one photo selected by `previewPhotoIndex` (or `mainPhotoIndex`, then photo 0); full collections stay on the detail page. Run `npm test` and `npm run build` before publishing.

## AI Study Assistant project and workshop materials

The Projects card is in `content.js` → `projects` with the stable id `ai-study-assistant`. Its permanent page is `https://bearai-bu.github.io/#/projects/ai-study-assistant`; page sections are in `studyAssistant()` in `app.js`.

Use this permanent **Workshop 1 Materials** URL for QR codes:

`https://bearai-bu.github.io/#/projects/ai-study-assistant?section=workshop-1-materials`

Keep that route and section id unchanged when adding materials. The router scrolls and focuses the materials heading on direct visits and refreshes. Add only ready, public files to `assets/` and the project's `materials` array (`title`, `description`, `file`, `label`). Do not add placeholder download buttons. Workshop 1 sample notes are `assets/workshop-1-sample-notes.pdf`. Slides, an activity guide, and an example prompt can be added when available. Add optional testing examples only after Workshop 1 and check missing-information questions against the final notes first.

Keep Workshop 2 and 3 implementation details high-level until finalized. Event dates, locations, and gallery content remain in the shared event records, not on the permanent project page. Run `npm test` and `npm run build`, and check the materials direct link and PDF before publishing.
