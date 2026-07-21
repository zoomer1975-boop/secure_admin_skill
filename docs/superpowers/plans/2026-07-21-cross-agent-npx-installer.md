# Cross-Agent npx Skill Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, document, test, and publish a GitHub-executable npm CLI that installs `building-secure-admin-pages` for Codex, Claude Code, or both.

**Architecture:** Keep one canonical skill under `skills/building-secure-admin-pages`. A dependency-free Node CLI preflights selected user-level destinations, refuses unsafe overwrites, and copies the skill; Node's built-in test runner exercises the real CLI in temporary home directories.

**Tech Stack:** Node.js 18+, ECMAScript modules, `node:test`, npm, Markdown, Git

## Global Constraints

- Support `--codex`, `--claude`, and `--all`; require exactly one target flag.
- Support `--force` only as an explicit overwrite opt-in.
- Install Codex to `$HOME/.agents/skills/building-secure-admin-pages`.
- Install Claude Code to `$CLAUDE_CONFIG_DIR/skills/building-secure-admin-pages` when set, otherwise `$HOME/.claude/skills/building-secure-admin-pages`.
- Use Node standard-library modules only.
- Never write tests into the real user home.
- Do not publish to npm in this task.
- Push the verified `master` branch to `https://github.com/zoomer1975-boop/secure_admin_skill`.

---

### Task 1: Installer RED-GREEN cycle

**Files:**
- Create: `test/install.test.mjs`
- Create: `bin/install.mjs`
- Create: `package.json`
- Create: `skills/building-secure-admin-pages/SKILL.md`
- Create: `skills/building-secure-admin-pages/agents/openai.yaml`

**Interfaces:**
- Consumes: the verified installed skill at `C:\Users\Owner\.codex\skills\building-secure-admin-pages`
- Produces: CLI flags `--codex`, `--claude`, `--all`, `--force`, and `--help`

- [ ] **Step 1: Add the package manifest and failing end-to-end tests**

Create `package.json` with `type: module`, a `building-secure-admin-pages` bin pointing to `bin/install.mjs`, Node `>=18`, `npm test` as `node --test`, and runtime package files limited to `bin` and `skills`.

Create `test/install.test.mjs` using `node:test`, `node:assert/strict`, `mkdtemp`, `spawnSync`, and temporary `HOME`/`USERPROFILE` values. Assert:

1. `--codex` copies `SKILL.md` and `agents/openai.yaml` to `.agents/skills/building-secure-admin-pages`.
2. `--claude` honors a temporary `CLAUDE_CONFIG_DIR`.
3. `--all` refuses a pre-existing target before creating the other target.
4. `--all --force` replaces the existing target and installs both.
5. `--codex --claude` exits nonzero and prints the one-target requirement.

- [ ] **Step 2: Verify RED**

Run: `npm test`

Expected: FAIL because `bin/install.mjs` and the packaged skill do not exist.

- [ ] **Step 3: Add the minimal installer and canonical skill**

Implement `bin/install.mjs` with only `node:fs/promises`, `node:os`, `node:path`, and `node:url`. Resolve all targets first; verify packaged `SKILL.md`; preflight all target existence; refuse before writing if any exists without `--force`; with `--force`, remove only the exact skill target; recursively copy the canonical skill; print installed paths. Catch errors once at the CLI boundary and set exit code 1.

Create the packaged `SKILL.md` and `agents/openai.yaml` as exact UTF-8 copies of the currently validated installed skill.

- [ ] **Step 4: Verify GREEN and validate the packaged skill**

Run:

```powershell
npm test
$env:PYTHONUTF8='1'
python 'C:\Users\Owner\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'skills\building-secure-admin-pages'
```

Expected: all Node tests pass and the validator prints `Skill is valid!`.

- [ ] **Step 5: Commit the installer**

```powershell
git add -- package.json bin test skills
git commit -m "feat: add cross-agent skill installer"
```

### Task 2: GitHub README and package verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: the Task 1 CLI and the repository URL
- Produces: GitHub usage instructions for direct `npx` installation

- [ ] **Step 1: Write the Korean GitHub README**

Include:

- Project purpose and the `building-secure-admin-pages` skill name.
- Short safeguards summary: named accounts, super/sub-admin separation, TOTP, IP allowlists, server authorization, immutable fail-closed audit logging, and privacy retention/destruction checks.
- Requirement: Node.js 18+.
- GitHub commands using `npx --yes github:zoomer1975-boop/secure_admin_skill -- --codex`, `--claude`, and `--all`.
- `--force` overwrite example and warning.
- Installed paths and invocation examples (`$building-secure-admin-pages` for Codex and `/building-secure-admin-pages` for Claude Code).
- Statement that the skill is a development standard, not legal advice, and current Korean official sources must be checked when compliance matters.

- [ ] **Step 2: Verify documentation and package contents**

Run:

```powershell
npm test
npm pack --dry-run
git diff --check
```

Expected: tests pass; the package includes `package.json`, `README.md`, `bin/install.mjs`, `SKILL.md`, and `agents/openai.yaml`; no generated tarball exists; diff check is clean.

- [ ] **Step 3: Commit the README**

```powershell
git add -- README.md
git commit -m "docs: add GitHub installation guide"
```

### Task 3: Publish to GitHub

**Files:**
- Modify: Git remote configuration only

**Interfaces:**
- Consumes: clean verified `master`
- Produces: GitHub `master` at the same commit

- [ ] **Step 1: Add the requested remote**

```powershell
git remote add origin https://github.com/zoomer1975-boop/secure_admin_skill.git
```

Expected: `origin` resolves to the requested repository. If `origin` already exists, verify it matches instead of overwriting it.

- [ ] **Step 2: Run final local verification**

```powershell
npm test
npm pack --dry-run
python 'C:\Users\Owner\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'skills\building-secure-admin-pages'
git status --short
```

Expected: all checks pass and the worktree is clean.

- [ ] **Step 3: Push and verify the remote commit**

```powershell
git push -u origin master
git ls-remote origin refs/heads/master
git rev-parse HEAD
```

Expected: the remote and local SHA values are identical.
