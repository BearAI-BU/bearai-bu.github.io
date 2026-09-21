# Publish, troubleshoot, recover, and hand off

[README](../README.md) · [Content maintenance](maintenance.md) · [Events](events.md)

## Routine publication

1. Before editing, run `git status`. Save unfinished work on its branch, then `git switch main` and `git pull --ff-only origin main`. Create a descriptive working branch as shown in the maintenance guide.
2. Edit source files, not `dist/`. Run `npm start`; inspect the changed pages in the browser. Check a desktop width and a narrow/mobile width (browser developer tools offer device emulation). Check text, image crops, event categories, keyboard links, the mobile menu, and external links.
3. Run the actual checks and build:

```sh
npm test
npm run build
```

Tests run JavaScript syntax checks, resource-copy checks, event-date boundaries, bear symmetry, entrance/reduced-motion checks, and asset-reference checks. Some older tests lock approved content values: after an intentional change, review and update the corresponding assertions instead of blindly bypassing failures. A passed build does not replace visual review.

The build clears and regenerates **only `dist/`**, copying the explicit public-file list from `scripts/build.cjs`. It performs no compilation and installs no packages. `dist/` is ignored by Git. If you introduce a new top-level public file, add it to that allowlist; images under `assets/` are copied automatically. Documentation under `docs/` is read on GitHub and is not deployed.

4. Review what you will publish:

```sh
git status
git diff
git config user.name
git config user.email
```

Check that no private notes, credentials, member data, temporary files, or unrelated attachments are included. Stage explicit filenames. This example is for an event update; replace paths with the files you actually reviewed:

```sh
git add content.js assets/gim-september-2026.png
git diff --cached
git diff --cached --check
git commit -m "Confirm September 24 general interest meeting"
git push -u origin update-september-events
```

5. On GitHub, open a pull request from your branch to `main`. Have an appropriate maintainer review it and merge. The deployment workflow runs on pushes to **main**, not ordinary branch pushes or pull requests; run checks locally before review. Trusted maintainers may also commit directly to main if repository rules permit, then use `git push origin main`. Never force-push.
6. Open [Actions](https://github.com/BearAI-BU/bearai-bu.github.io/actions), select **Deploy BearAI to GitHub Pages**, and find the run for your commit. Wait for all steps to succeed: tests, build, upload, and Publish. If an environment approval is requested, an authorized reviewer must approve it.
7. Visit https://bearai-bu.github.io/ and the changed interior page. Reload it; check the new content, images, and navigation. A green workflow is required, but also verify the actual page. The site uses hash routes, for example `https://bearai-bu.github.io/#/events/general-interest`.

## Simple updates through GitHub’s website

This is practical for small text changes when you have repository access:

1. Open the repository and desired file, such as `content.js`.
2. Choose the pencil/Edit action. Make a small, carefully checked change without breaking commas, quotes, or braces.
3. Use **Commit changes**, supply a clear message, and choose a new branch/pull request for review. Follow the interface to create the pull request. Merge only after reviewing it.
4. For images, open `assets/`, choose **Add file → Upload files**, upload the approved image, and commit to the same branch. Then update the content reference on that branch. Coordinate both changes before merging so main never references a missing file.
5. A merge or direct commit to main triggers deployment automatically. Monitor Actions and the public page.

GitHub’s editor does not run the local preview or this project’s tests for you before committing. Its file preview is not the rendered website. The current deployment workflow checks after main changes; a failure prevents a new deployment. For complex edits, large images, uncertain syntax, or coordinated changes, use the local workflow and a reviewer. Do not treat GitHub’s general upload-size limits as a target for image sizes.

## One-time administrator setup

Already configured; routine contributors do not need to redo it. An organization/repository administrator maintains:

1. A public `BearAI-BU/bearai-bu.github.io` repository with `main` as the publishing branch.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `.github/workflows/pages.yml`, which grants the deployment job `contents: read`, `pages: write`, and `id-token: write`, and publishes `dist/` using the `github-pages` environment.
4. Organization/repository Actions policies that allow the GitHub-owned actions referenced by that workflow.

No custom domain, paid service, server password, or manually added deployment secret is required. The workflow uses GitHub’s job credentials. For a manual rerun, use **Actions → Deploy BearAI to GitHub Pages → Run workflow** on main. Optional branch protection and review requirements can be configured by administrators; they are not prerequisites for local editing.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| `git`, `node`, or `npm` not found | Install the official tools, reopen the terminal, and check versions. Use Node 22+. Do not copy machine-specific paths from another maintainer. |
| Dependency installation failed | This project needs no `npm install`. Confirm you are in the folder containing `package.json`. If someone later adds dependencies, follow the updated documented install command and inspect the actual error. |
| PowerShell blocks npm script | Use `npm.cmd` or Command Prompt; do not weaken execution policy. |
| Preview does not start | Read the terminal error. Run from the repository root; check Node version and `package.json`. |
| Port 4173 already in use | Stop the other preview with Ctrl+C in its terminal. Do not kill unrelated programs. If you deliberately change the port in `scripts/preview.cjs`, open the matching URL and keep documentation consistent. |
| Blank page/content syntax error | Run `npm test`; check the reported file/line for a missing comma, quote, brace, or bracket. Open the browser console for runtime errors. Fix source, then refresh. |
| Missing image | Check filename capitalization, extension, `assets/` location, and data reference; the live Linux server is case-sensitive. Confirm the image was committed. |
| Broken link | Use the complete approved HTTPS URL for external links. Internal pages use `#/route`. Keep event IDs stable. Do not invent replacements. |
| Wrong event time/category | Check `start`, `end`, explicit offsets, `timeZone`, hidden/cancelled flags, duplicate IDs, and device clock. Refresh. See the exact classification rules in the event guide. |
| Unexpected Up Next | Only future starts qualify; ongoing events are listed separately. Undated entries are fallbacks. Check for an earlier future event and reload. |
| Authentication failed | Sign in to your own GitHub account using the normal Git credential-manager or GitHub CLI flow. GitHub does not accept account passwords as Git-over-HTTPS passwords. Never paste tokens into chat, README, source, or remote URLs. |
| Permission denied / 403 | Verify the account, accepted invitation, repository write permission, and any organization authorization with an owner. Changing Git author name does not grant access. |
| Push rejected | Someone may have pushed first, or branch rules require a pull request. Fetch and inspect; do not force-push. Use the conflict steps below. |
| Workflow failed | Open the failed Actions step. Fix test/build errors locally. For permission/Pages-source errors, ask an administrator to inspect the one-time setup. Push a follow-up commit and monitor it. |
| Live changes absent | Confirm you merged/pushed to main, Actions succeeded for that commit, and the URL is the public site rather than localhost. Reload without cache or use a private window. Allow CDN propagation. Check filename case and the build allowlist for new top-level files. |

### Conflicting edits

1. Save your changes in a local commit on your working branch.
2. Run `git fetch origin`, then `git merge origin/main` on that branch.
3. If Git reports conflicts, open the marked files. Compare both versions with the other contributor; remove conflict markers only after retaining the intended final content.
4. Run checks and visual review, then `git add` the resolved files and `git commit`. Push normally and update the pull request.
5. If unsure how to resolve the merge, `git merge --abort` cancels that merge and returns to its pre-merge state. Ask another maintainer to review. Do not delete their changes or use force-push as a fix.

## Safe recovery

For an uncommitted edit, first copy the affected file outside the repository if you may need the work. Use `git diff` to inspect it. `git restore -- path/to/file` discards that file’s uncommitted changes and restores its committed version; use it only after confirming you want that loss. `git restore --staged path/to/file` merely unstages it and keeps your working edits.

For a committed change, whether already published or still local, prefer a new reversing commit:

```sh
git log --oneline -5
git revert COMMIT_SHA
npm test
npm run build
git push origin main
```

Replace `COMMIT_SHA` with the exact commit you reviewed, and use your normal pull-request branch if required. Revert preserves shared history and triggers a deployment when it reaches main. Reverting a merge commit requires additional care; ask an experienced maintainer rather than guessing the mainline option. Avoid `reset --hard`, deleting history, or force-pushing as recovery shortcuts.

## Officer handoff

1. Keep more than one appropriate, trusted maintainer with access. An organization owner should invite successors using their own accounts and give the minimum repository/team role needed. Give owner/admin access only where it is actually needed.
2. Walk the successor through cloning, running, editing a sample branch, testing, submitting a pull request, and checking a deployment. Confirm they can access Pages and Actions as appropriate before outgoing officers lose access.
3. Point them to this README, `docs/`, the Pages settings, and `.github/workflows/pages.yml`. Keep public contact links and source-review notes current. Remove departed access through the organization’s normal handoff process.
4. Do not share passwords, recovery codes, tokens, private member data, or personal authentication configuration in the repository. Use two-factor authentication and approved account-recovery practices.
5. Periodically review the supported Node version and the action versions in the workflow. There are currently no npm dependencies to update. If dependencies are introduced, commit the appropriate package manifest/lockfile and document installation. Test any tooling upgrade before merging and update these guides in the same change.

Optional improvements such as branch protection, more pre-merge CI, image optimization, or a content-management system are separate projects. They are not necessary for the documented routine workflow.
