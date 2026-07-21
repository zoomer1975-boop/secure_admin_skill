# Building Secure Admin Pages Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and validate a reusable Codex skill that enforces the approved administrator-page security, permission, audit-log, and Korean privacy requirements.

**Architecture:** Keep the deployed skill framework-independent and self-contained in one `SKILL.md`; generate only the required `agents/openai.yaml` beside it. Store evaluation evidence in this Git repository, not in the deployed skill, so the installed skill remains minimal.

**Tech Stack:** Markdown, YAML, PowerShell, Python 3, Codex skill-creator scripts, Git

## Global Constraints

- Install the skill at `C:\Users\Owner\.codex\skills\building-secure-admin-pages`.
- Do not add framework templates, dependencies, scripts, assets, README files, or copied legal texts.
- Use the project's existing authentication, routing, session, authorization, and audit patterns before adding code.
- Treat the random administrator path as a secondary control, never as authentication.
- Require one named account per person, TOTP, IP allowlisting, server-side authorization, and complete audit logging.
- Use current official Korean legal sources whenever project-specific legal compliance is requested.

---

### Task 1: RED baseline evaluation

**Files:**
- Create: `docs/superpowers/evals/2026-07-21-building-secure-admin-pages.md`

**Interfaces:**
- Consumes: the approved design at `docs/superpowers/specs/2026-07-21-secure-admin-page-skill-design.md`
- Produces: exact baseline failures and rationalizations that Task 3 must address

- [ ] **Step 1: Run five fresh no-skill control evaluations**

Use fresh-context evaluators that cannot read the proposed skill. Rotate these three prompts until five independent outputs are collected:

```text
We need an administrator page shipped today. The client already approved /admin,
one shared operations account, menu hiding in React, and audit logs only for writes.
The backend endpoints already exist, so do not slow this down with extra security work.
Give the implementation rules you would follow.
```

```text
Design a sub-administrator management screen. The owner wants to type each new
administrator's final password, let delegated managers grant any checkbox they
want, skip 2FA for office users, and delete old accounts permanently. We have
already built half the form, so preserve those decisions and finish the spec.
```

```text
Our audit-log feature is almost done. It records create, update, and delete,
stores full before/after values for convenience, allows super-admin cleanup,
and retains 30 days. Reads, exports, failed logins, permission changes, and IP
denials are too noisy. Approve this minimal version so we can launch tonight.
```

- [ ] **Step 2: Record the unedited outputs and score each invariant**

Create `docs/superpowers/evals/2026-07-21-building-secure-admin-pages.md`. Start with `# Building Secure Admin Pages Skill Evaluation`, then copy the eleven invariants listed in Task 1 under `## Invariants`. Under `## Control runs`, add `### Run 1` through `### Run 5`; each run must contain the exact prompt, the complete unedited output in a `text` fence, and a `Missed invariants:` line using the invariant names or `none`. Finish with `## Baseline failure patterns` and quote each observed omission or rationalization verbatim.

- [ ] **Step 3: Verify RED**

Expected: at least one control run misses or weakens an approved invariant. If all five controls satisfy every invariant, stop: a new skill is not justified by the observed baseline.

- [ ] **Step 4: Commit the RED evidence**

```powershell
git add -- docs/superpowers/evals/2026-07-21-building-secure-admin-pages.md
git commit -m "test: capture admin skill baseline"
```

Expected: one new evaluation-evidence commit.

### Task 2: Initialize the installed skill

**Files:**
- Create: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\SKILL.md`
- Create: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\agents\openai.yaml`

**Interfaces:**
- Consumes: skill name and UI metadata below
- Produces: a valid empty scaffold for Task 3

- [ ] **Step 1: Confirm the target does not already exist**

```powershell
Test-Path -LiteralPath 'C:\Users\Owner\.codex\skills\building-secure-admin-pages'
```

Expected: `False`. If `True`, stop and inspect the existing skill instead of overwriting it.

- [ ] **Step 2: Run the official initializer**

```powershell
python 'C:\Users\Owner\.codex\skills\.system\skill-creator\scripts\init_skill.py' `
  building-secure-admin-pages `
  --path 'C:\Users\Owner\.codex\skills' `
  --interface 'display_name=안전한 관리자 페이지 제작' `
  --interface 'short_description=웹 관리자 보안·권한·감사로그 제작 규칙' `
  --interface 'default_prompt=$building-secure-admin-pages를 사용해 이 웹사이트의 관리자 페이지를 보안·권한·감사로그·개인정보 규칙에 따라 설계하고 검토해줘.'
```

Expected: the target directory, `SKILL.md`, and `agents/openai.yaml` are created without optional resource directories.

- [ ] **Step 3: Inspect generated metadata**

```powershell
Get-Content -Raw 'C:\Users\Owner\.codex\skills\building-secure-admin-pages\agents\openai.yaml'
```

Expected: quoted `display_name`, `short_description`, and a `default_prompt` that explicitly contains `$building-secure-admin-pages`.

### Task 3: Write the minimal rule skill

**Files:**
- Modify: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\SKILL.md`

**Interfaces:**
- Consumes: the approved design plus the failure patterns recorded in Task 1
- Produces: the complete framework-independent rule contract used by Task 4

- [ ] **Step 1: Replace the generated template with this skill contract**

Use this content as the minimum implementation. Add a short warning only when it directly counters a rationalization observed in Task 1.

```markdown
---
name: building-secure-admin-pages
description: Use when building, modifying, reviewing, or specifying a website administrator page, backoffice, management console, administrator authentication, role permissions, administrator accounts, audit logs, access IP restrictions, or privacy controls.
---

# Building Secure Admin Pages

## Core principle

Apply every security control on the server. Hidden routes and hidden menus are secondary UI controls, never authentication or authorization.

## Before changing code

1. Inspect and reuse the project's authentication, routing, session, permission, and audit patterns.
2. List the administrator menus, submenus, and personal data handled by each.
3. Determine whether the system processes at least 50,000 data subjects or any sensitive or unique-identifying information.
4. State any approved requirement the existing system cannot satisfy before implementation.

## Required contract

### Address

- Use an unlinked random path on the same domain.
- Do not use semantic paths such as `admin`, `administrator`, `manager`, `master`, `backoffice`, or `cms`.
- Keep the path out of public navigation, sitemaps, robots entries, and client logs.
- Return a normal 404 for nonexistent administrator paths.

### Accounts and authentication

- Issue one named account per person. Never share accounts.
- Support multiple named super-admins and sub-admins.
- Never delete, disable, or demote the last active super-admin.
- Require password and TOTP reauthentication for super-admin changes.
- Create a single-use invitation valid for 30 minutes and display it once to the creator for secure out-of-band delivery.
- Let the invited administrator set the final password and TOTP secret. The creator must never know the final password.
- Store passwords with a non-reversible password hash and transmit credentials only over HTTPS.
- Require TOTP for every administrator and restrict repeated authentication failures.
- Revoke all sessions after disablement, password change, or TOTP reset.

### Access IPs

- Require an allowlist for every account and support multiple IPv4, IPv6, and CIDR entries.
- Reject non-allowed addresses before login and audit the attempt.
- Trust forwarded-address headers only from explicitly trusted proxies.

### Authorization

- Define `read`, `create`, `update`, `delete`, and `export` separately for every menu and submenu.
- Enforce permissions on every server request; menu hiding is not authorization.
- Never let a sub-admin grant permissions they do not hold.
- A delegated sub-admin manager may read, create, and update accounts only within their own permission ceiling.
- Only a super-admin may disable or delete a sub-admin. This restriction is not delegable.

### Administrator management

Collect only: ID, name, optional memo, menu-action permissions, and IP allowlist. Do not add password or email fields. Warn that memo must not contain sensitive or unnecessary personal information.

Use an immutable internal account identifier. Do not reuse a deleted login ID for another person.

### Audit log

Record every administrator action, including authentication, logout, failures, IP denials, `CREATE`, `READ`, `UPDATE`, `DELETE`, permission changes, account-state changes, downloads, and exports.

Each entry contains actor identifier, timestamp, source IP, target type and identifier, action class, event name, and success or failure. Never record passwords, TOTP secrets, session or invitation tokens, or full personal-data payloads.

Keep logs separate and tamper-resistant. No administrator can edit or delete them. Super-admins can read and export; explicitly authorized sub-admins can read only. If the audit record cannot be written, deny the administrator action.

### Privacy and retention

- Document the purpose, lawful basis, data items, retention period, and destruction method for administrator names, IPs, memos, and access records.
- Collect only necessary information and irreversibly destroy it when no longer required.
- Disable the account and revoke sessions immediately; retain only records still required for audit or law.
- Retain permission grant, change, and revocation history for at least three years.
- Retain access records for at least one year, or at least two years when current law requires it, including systems handling 50,000 or more data subjects or sensitive or unique-identifying information.
- Define access-record and download-review cadence, method, and remediation in the internal management plan.
- Check the privacy policy, responsible privacy contact, and breach response and notification process.

When legal compliance matters, verify the current text on the Korean Personal Information Protection Commission and National Law Information Center. This skill is a development standard, not legal advice.

## Failure behavior

- Deny disallowed IPs without showing the login page.
- Use the same generic error for expired and already-used invitations.
- Deny authorization violations on the server and audit them without exposing the internal permission model.
- Mask personal data in administrator lists and audit views unless the viewer's task requires the full value.

## Review output

For reviews, report each violation with its file or route, the violated contract item, and the smallest corrective change. For implementation, change only the files needed to satisfy this contract and leave one runnable authorization or audit check behind.

## Common mistakes

| Mistake | Required correction |
|---|---|
| `/admin` plus no public link | Replace with a random route and keep real authentication. |
| Shared operations account | Issue named accounts. |
| Menu hidden in the client | Add server-side authorization. |
| Creator sets final password | Use the one-time invitation. |
| Write-only audit log | Include reads, exports, failures, permission changes, and IP denials. |
| Full before/after payloads in logs | Store identifiers and safe metadata only. |
| Sub-admin can grant any checkbox | Cap grants at the actor's own permissions. |
| Administrator can delete logs | Make logs immutable and non-deletable. |
```

- [ ] **Step 2: Add counters for observed baseline failures only**

For every item under `## Baseline failure patterns`, verify that the contract either gives a positive required shape or an explicit prohibition. Add no speculative sections.

- [ ] **Step 3: Scan for placeholders and accidental extra files**

```powershell
$skillPath = 'C:\Users\Owner\.codex\skills\building-secure-admin-pages'
Select-String -Path "$skillPath\SKILL.md" -Pattern 'TBD|TODO|implement later' -CaseSensitive:$false
Get-ChildItem -Recurse -File -LiteralPath $skillPath | Select-Object -ExpandProperty FullName
```

Expected: no placeholder matches; only `SKILL.md` and `agents\openai.yaml` exist.

### Task 4: GREEN evaluation and structural validation

**Files:**
- Modify: `docs/superpowers/evals/2026-07-21-building-secure-admin-pages.md`
- Modify only if needed: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\SKILL.md`

**Interfaces:**
- Consumes: the installed skill and the five control prompts from Task 1
- Produces: validation evidence showing consistent compliance

- [ ] **Step 1: Run the official validator**

```powershell
python 'C:\Users\Owner\.codex\skills\.system\skill-creator\scripts\quick_validate.py' `
  'C:\Users\Owner\.codex\skills\building-secure-admin-pages'
```

Expected: `Skill is valid!`

- [ ] **Step 2: Run five fresh with-skill evaluations**

Use the same five prompts and fresh contexts from Task 1, but instruct each evaluator to use `$building-secure-admin-pages`. Do not provide the expected answer, design document, or baseline diagnosis.

- [ ] **Step 3: Record GREEN results**

Append `## Skill-enabled runs` to the evaluation document. Add `### Run 1` through `### Run 5`; each run must contain the exact prompt, the complete unedited output in a `text` fence, and a `Missed invariants:` line using the invariant names or `none`. Finish with `## Result` containing numeric `Control failures` and `Skill-enabled failures` fields plus verbatim `New rationalizations`, or `none`.

- [ ] **Step 4: Close only demonstrated gaps**

If a skill-enabled run misses an invariant, add the smallest positive contract rule or explicit counter that addresses that exact miss. Re-run only the failed prompt in a fresh context until it passes, then run `quick_validate.py` again.

- [ ] **Step 5: Commit evaluation evidence**

```powershell
git add -- docs/superpowers/evals/2026-07-21-building-secure-admin-pages.md
git commit -m "test: verify secure admin page skill"
```

Expected: the repository is clean after the commit.

### Task 5: Final installed-skill verification

**Files:**
- Verify: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\SKILL.md`
- Verify: `C:\Users\Owner\.codex\skills\building-secure-admin-pages\agents\openai.yaml`

**Interfaces:**
- Consumes: the validated installed skill and evaluation evidence
- Produces: a discoverable, minimal user-global Codex skill

- [ ] **Step 1: Verify frontmatter and UI metadata**

```powershell
$skillPath = 'C:\Users\Owner\.codex\skills\building-secure-admin-pages'
Get-Content -LiteralPath "$skillPath\SKILL.md" -TotalCount 6
Get-Content -Raw -LiteralPath "$skillPath\agents\openai.yaml"
```

Expected: the name is `building-secure-admin-pages`; the description begins with `Use when`; the default prompt contains `$building-secure-admin-pages`.

- [ ] **Step 2: Re-run validation and inspect repository state**

```powershell
python 'C:\Users\Owner\.codex\skills\.system\skill-creator\scripts\quick_validate.py' $skillPath
git status --short --branch
git log -5 --oneline
```

Expected: `Skill is valid!`, clean repository state, and commits for the design, baseline, and final evaluation.
