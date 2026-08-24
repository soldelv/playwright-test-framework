---
name: create-pull-request
description: 'Validate the current working tree (compile, lint, tests pass, no unused code), generate a structured PR title and description from the diff and any linked test plan / heal plan / triage report, then open the pull request in Azure DevOps. Refuses to open the PR if any quality gate fails.'
---

# Create Pull Request

Take the changes currently in the working tree (or in a feature branch), run all required quality gates, and
open a pull request in GitHub with a generated title and structured description. The PR is **only opened
when every gate passes** — otherwise the agent reports the failures and stops.

This is the natural counterpart to a review workflow: one creates the PR, the other reviews it.

## When to use

- The user says "create the PR", "open a pull request", "PR the changes", "ship it".
- After `@implement-test-cases` (or any of the maintenance agents) when the work is ready.
- After a manual fix the user wants packaged into a reviewable PR.

## Inputs

- `targetBranch` (optional, default `main`) — branch the PR will target
- `prTitle` (optional) — if omitted, generated from the diff + linked plan/triage/heal documents
- `draft` (optional, default `false`) — open as draft
- `reviewers` (optional) — comma-separated list of Azure DevOps users to add
- `workItemIds` (optional) — comma-separated list of Azure DevOps work item IDs to link

## Prerequisites

- GitHub CLI installed and authenticated (`gh auth login`)
- The repo is a git repo with a GitHub `origin`
- A feature branch exists (or the agent will create one — see step 2)

## Step-by-step procedure

### 1. Read project conventions

- `.github/instructions/general.instructions.md` (no dead code, no `Map<String, Object>`, compile command, code
  format)
- `.github/instructions/test-patterns.instructions.md` (assertion / cleanup / runner rules)
- `.github/instructions/<service>.instructions.md` for every service touched

### 2. Inspect the working tree and ensure a feature branch with a ticket or task reference

```bash
git status --porcelain
git rev-parse --abbrev-ref HEAD
git diff --stat <targetBranch>...HEAD
```

**The current branch SHOULD contain a task or ticket reference** when available. Accepted patterns (case-insensitive):

- `<type>/<id>-<slug>` — e.g., `feature/104783-create-user-flow`
- `<type>/<project>-<id>-<slug>` — e.g., `bugfix/APP-1234-fix-login`
- `<type>/<slug>-<id>` — e.g., `fix/login-1234`

Where `<type>` ∈ `feature` / `bugfix` / `fix` / `chore` / `test` / `refactor` / `hotfix`.

If the current branch is `main` / `master` / the configured `targetBranch`, OR does not contain a task reference:

- **Ask the user for the ticket or task ID if available**
- If the user does not provide one, proceed with a descriptive branch name such as:
  `feature/<short-description>`
- If a ticket ID is provided, create and switch to a branch like:
  ```bash
  git checkout -b feature/<id>-<slug>
  ```
- Add the ticket ID to `workItemIds` if provided, so it can be referenced in the PR body

If the current branch is valid, extract any task ID and add it to `workItemIds` if present.

If there are uncommitted changes, list them and ask the user whether to:

- Commit the intended non-properties files into a single commit on the current branch
- Stash and abort
- Split into multiple commits (in which case suggest commit groupings by file area)

Never offer to commit `src/main/resources/acc.properties`, `src/main/resources/tst.properties`, or
`src/main/resources/global.properties`. These tracked files are local-only configuration and must remain unstaged and
uncommitted. Never use `git add -A` or `git add .` when they are modified.

### 2a. Mandatory protected-properties guard

Run this guard before every commit, before pushing, and before opening the PR:

```bash
PROTECTED_PROPERTIES='^src/main/resources/(acc|tst|global)\.properties$'

git diff --cached --name-only | grep -E "$PROTECTED_PROPERTIES" || true
git diff --name-only <targetBranch>...HEAD -- \
  src/main/resources/acc.properties \
  src/main/resources/tst.properties \
  src/main/resources/global.properties
```

If either command reports a file:

- Stop immediately. Do not commit, push, or create/update a PR.
- Keep the user's local configuration change intact, but remove it from the index with
  `git restore --staged <file>`.
- If it is already committed, instruct the user that the branch history must be rewritten to remove it before any
  push. Treat credentials in a committed properties file as exposed and require credential rotation.

### 3. Quality gate 1 — Compilation

```bash
mvn -DskipTests test-compile
```

If it fails, stop and report. Do not run further gates.

### 4. Quality gate 2 — IDE-equivalent error / warning check

For every file changed in this branch (`git diff --name-only <targetBranch>...HEAD`):

- Run `get_errors` on the absolute file path
- Collect all errors and warnings

Fail the gate if any **error** is present. Warnings are surfaced in the PR description (not blocking) unless the
user invoked the agent with `--strict-warnings`.

### 5. Quality gate 3 — Dead-code / unused-symbol check

Project rule (`general.instructions.md` → "No dead code"): every method/constant/class added must be referenced.

For each changed Java file:

```bash
# New public methods introduced in this branch
git diff <targetBranch>...HEAD -- '*.java' | grep -E '^\+.*public (static )?[A-Za-z<>]+\s+[a-zA-Z_]+\(' || true
```

For each new public symbol, grep the repo for references. If a symbol has **zero references outside its
declaration**, flag it as a dead-code violation.

Also check:

- New constants in `<Service>TestData` referenced by at least one factory / test
- New factory methods referenced by at least one test / data provider
- New helper methods referenced by at least one test
- New assertion methods referenced by at least one test
- New JSON schema files referenced by at least one contract test

If any unused symbol is found, fail the gate and list them with their file/line.

### 6. Quality gate 4 — Tests pass

Determine the affected test scope:

| Files changed include | Scope to run |
|----------------------|--------------|
| Files in only one service package | That service's regression suite (`src/test/resources/runners/<service>/<service>-regression-tst.xml`) |
| Files in multiple services | `full-regression-all-services.xml` |
| Only contract / schema files | The service's schema suite |
| Only docs / specs / runner XML | Skip — note in PR description |

Run via `@run-and-triage-tests` (or directly if that agent isn't invokable here):

```bash
mvn test -DsuiteXmlFile=<chosen-runner>
```

Fail the gate if any test fails. Rerun failed tests once to detect flakiness; if still failing, stop.

### 7. Collect contextual artifacts for the PR description

Look for and include (if present):

- test plan or implementation notes in the repo, if they exist under a docs or planning folder changed in this branch
- any local notes about the change, if they are part of the diff
- work item IDs from commit messages (for example `#12345` or `ABC-1234`) and from the `workItemIds` input

### 8. Generate the PR title

Format:

```
<type>(<scope>): <imperative summary>
```

Where:

- `type` ∈ `feat` / `fix` / `test` / `refactor` / `chore` / `docs` / `ci`
- `scope` is the service package or `multi` if more than one
- `imperative summary` is one line, ≤ 72 chars, derived from the work item title or the dominant change

Examples:

- `test(ijaToegang): add regression tests for CreatePortalUserIDIN`
- `fix(ijaToegang): restore username cleanup in UpdateUsernameTest`
- `chore(runners): register new IjaIdin contract test in schema suite`

### 9. Generate the PR description

The description is the reviewer handoff. Keep it factual, concise, and complete enough to review the change without
reconstructing context from commits or pipeline logs.

**Description standards:**

- State only results that were verified during this run. Use `Not run`, `Not available`, or `N/A` rather than claiming
  a check passed without evidence.
- Explain both **what** changed and **why** in the Summary; do not repeat the PR title.
- Include only changed files that are meaningful to review. Group generated, configuration, test, and documentation
  changes when that is clearer than listing every file.
- Mark exactly one Type of change checkbox unless the PR intentionally spans multiple types; explain any exception in
  Reviewer notes.
- Record the exact validation scope and result counts. Flag reruns, flaky behavior, skipped tests, and unavailable CI
  as risks instead of presenting them as clean passes.
- Display resolved User Stories as `US#<id>` in the description. Continue passing numeric IDs to
  `--work-items` so Azure DevOps creates the work-item link. If no work item exists, write `None` and explain why in
  Reviewer notes.
- Use Reviewer notes for breaking changes, configuration changes, migration steps, known defects, disabled tests,
  rollout considerations, and decisions the reviewer must make.
- Complete the Checklist with the actual outcome (`[x]` only for verified checks). Remove rows that are not applicable
  only when their absence is self-evident from the PR scope.

Use this template (Markdown):

```markdown
## Summary

<2–4 sentences: what changed, why it is needed, and the relevant user or service impact.>

## Linked work items

<!-- Auto-linked via "AB#<id>" in commit messages -->
- US#<id> — <title>

## Type of change

- [ ] feat — new functionality
- [ ] fix — bug fix
- [ ] test — new or updated tests
- [ ] refactor — no behaviour change
- [ ] chore / docs / ci

## Changes

### Files created

| File | Purpose |
|------|---------|
| `<path>` | <one-line> |

### Files updated

| File | Change |
|------|--------|
| `<path>` | <one-line> |

### Runner XML updates

| File | Change |
|------|--------|

## Test results

| Suite | Total | Passed | Failed | Skipped | Duration |
|-------|-------|--------|--------|---------|----------|
| `<runner xml>` | <n> | <n> | <n> | <n> | <mm:ss> |

- Compile: Verified / Not run / Not available
- IDE errors: Verified / Not run / Not available (warnings: <n>)
- Dead-code check: Verified / Not run / Not available
- Test run: Verified / Not run / Not available
- Rerun stability: Stable / Flaky / Not applicable

## Documents

<!-- Links inside the repo to the supporting markdown -->
- Test plan: `src/test/resources/test-plan/.../<featurename>/<Feature>_TestCases.md`
- Refined plan: `..._TestCases_Refined.md`
- Implementation plan: `..._ImplementationPlan.md`
- Triage report (if any): `target/triage/...`

## Reviewer notes

<!-- Configuration changes, known defects, disabled tests, rollout steps, risks, and reviewer decisions -->
- <e.g., "Cleanup pattern uses `onlyForGroups`; see test-patterns.instructions.md">
- <open questions, known limitations, or `None`>

## Checklist

- [ ] `mvn -DskipTests test-compile` passes
- [ ] All affected tests pass (see Test results)
- [ ] No `Map<String, Object>` / `Map.class` introduced
- [ ] No dead code (every new public symbol is referenced)
- [ ] Generated model classes used for all request/response handling
- [ ] Cleanup uses `@AfterMethod(onlyForGroups=...)` (no method-name matching)
- [ ] Allure annotations present at class level
- [ ] Runner XMLs updated for any new test class
- [ ] No unrelated reformatting
```

### 10. Commit (if needed) and push

If there are uncommitted changes that the user agreed to commit in step 2:

```bash
# Explicitly list only reviewed, non-properties paths.
git add -- <non-properties-file-1> <non-properties-file-2>
git commit -m "<generated PR title>" -m "<short summary>"
```

If multiple commits were preferred, prompt and commit per grouping.

Push the branch:

```bash
git push -u origin <current-branch>
```

### 11. Open the pull request via GitHub CLI

```bash
gh pr create \
  --base "<targetBranch>" \
  --head "<current-branch>" \
  --title "<generated title>" \
  --body "<generated description>" \
  $( [ "<draft>" = "true" ] && echo "--draft" ) \
  $( [ -n "<reviewers>" ] && echo "--reviewer <reviewers>" )
```

Capture the PR URL from the output.

### 12. Present a summary

Tell the user:

- PR URL
- Quality gate results (compile / errors / dead-code / tests)
- Test counts (total / pass / fail / skipped / duration)
- Files created / updated counts
- Linked work items
- Any non-blocking warnings included in the description
- Suggested follow-up: `@review-pull-request <PR ID>`

## Quality-gate failure behaviour

If any gate fails, the agent **does NOT open the PR**. Instead it produces a short report:

```
❌ PR creation aborted.

Failed gates:
- Tests:  3 failures in IjaToegangRegression suite
  → @run-and-triage-tests src/test/resources/runners/ija-toegang/ija-toegang-regression-tst.xml

- Dead code: 2 unused symbols
  → src/test/java/.../FooFactory.java:42  withUnusedScenario()
  → src/test/java/.../FooTestData.java:18 UNUSED_CONSTANT

Fix the failures and re-run @create-pull-request.
```

## Important rules

- **The branch name should include a ticket or task reference when available.** If missing, ask the user for it; otherwise use a descriptive feature name.
- **No PR is opened until every gate passes.** Period.
- **Never push to `main`.** If the current branch is `main`/`targetBranch`, refuse and ask for a feature branch.
- **Protected properties files never enter a commit or PR.** `acc.properties`, `tst.properties`, and
  `global.properties` are local-only. Run the mandatory protected-properties guard before every commit, push, and PR
  operation; any matching path blocks the operation.
- **Never amend or force-push** an existing branch unless the user explicitly opts in.
- **Never bypass the dead-code check** — the repo rule is explicit.
- **PR title follows `<type>(<scope>): <summary>`.** No emojis, ≤ 72 chars.
- **PR description must include the auto-filled Test results table.** Reviewers must see the numbers without
  opening the build.
- **Work item references are optional but helpful** if the branch or commit includes them; include them in the PR body when present.
- **Warnings are listed but non-blocking** unless `--strict-warnings` was passed.

## Checklist

- [ ] Project instructions read
- [ ] Branch is not `main`/`targetBranch`
- [ ] Branch name includes a task or ticket reference when available
- [ ] Ticket ID extracted from branch and added to `workItemIds` when present
- [ ] Working tree state acknowledged (committed / stashed / split per user choice)
- [ ] Protected-properties guard passed before commit, push, and PR creation
- [ ] Compile passes
- [ ] `get_errors` clean on every changed file (warnings recorded)
- [ ] Dead-code check passes
- [ ] Affected test scope chosen and run; all pass (or stable after one rerun)
- [ ] Contextual artifacts (test plans, triage, heal, audit) collected
- [ ] PR title generated in `<type>(<scope>): <summary>` form
- [ ] PR description generated from template, including Test results table
- [ ] Changes committed (if needed) and branch pushed
- [ ] PR opened via `gh pr create`
- [ ] PR URL + summary presented to user with a follow-up review suggestion

