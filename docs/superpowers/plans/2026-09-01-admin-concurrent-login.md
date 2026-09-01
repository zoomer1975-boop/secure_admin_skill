# Admin Concurrent Login Restriction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mandatory one-active-session-per-account contract to the installed secure-admin Skill, where a successful login terminates the account's earlier session.

**Architecture:** Extend the existing `Accounts and authentication` contract in `SKILL.md`; no installer or runtime code changes are needed because the package copies that file unchanged. Pin every part of the contract in the existing installer integration test so an incomplete future edit fails.

**Tech Stack:** Markdown Skill contract, Node.js 18+, built-in `node:test` and `node:assert`.

## Global Constraints

- Allow exactly one active session per administrator account, enforced on the server.
- The newest successful login wins: invalidate the earlier session before issuing the new one and block the earlier session's later requests.
- Judge duplication by the immutable internal account identifier, never by browser, device, or IP address.
- Disclose nothing about the surviving session to the terminated one beyond the fact that the account signed in elsewhere.
- Audit the duplicate login and the forced logout as separate entries without session tokens, and require the limit in the internal management plan.
- Do not change the README, installer, package structure, or any existing security contract.
- Add no dependency or new abstraction.

---

### Task 1: Pin and add the concurrent-login contract

**Files:**
- Modify: `test/install.test.mjs:48-74`
- Modify: `skills/building-secure-admin-pages/SKILL.md:39`

**Interfaces:**
- Consumes: the existing installer behavior that copies `skills/building-secure-admin-pages/SKILL.md` into the target Skill directory.
- Produces: required English contract text in the installed `SKILL.md`, verified by the existing `installs the complete skill for Codex` integration test.

- [ ] **Step 1: Write the failing test**

Add these expressions to the requirement array in `test/install.test.mjs`:

```js
    /Allow only one active administrator session per account/,
    /invalidate the earlier session on the server before issuing the new one/,
    /Identify the duplicate by the immutable internal account identifier, never by browser, device, or IP address/,
    /Tell the terminated session only that the account signed in elsewhere.*Never disclose the other session's IP address, device, or location/,
    /Audit the duplicate login and the resulting forced logout as separate entries without recording session tokens/,
    /require the one-session limit in the internal management plan/,
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
node --test test/install.test.mjs
```

Expected: `installs the complete skill for Codex` fails with `The input did not match the regular expression` for the first new concurrent-login requirement.

- [ ] **Step 3: Add the minimal Skill contract**

Insert the following bullets in `skills/building-secure-admin-pages/SKILL.md` immediately after the existing session-revocation requirement:

```markdown
- Allow only one active administrator session per account. When authentication succeeds for an account that already has an active session, invalidate the earlier session on the server before issuing the new one and reject every later request from the earlier session.
- Identify the duplicate by the immutable internal account identifier, never by browser, device, or IP address, so a second browser, device, or network cannot hold a parallel session.
- Tell the terminated session only that the account signed in elsewhere. Never disclose the other session's IP address, device, or location.
- Audit the duplicate login and the resulting forced logout as separate entries without recording session tokens, and require the one-session limit in the internal management plan.
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```powershell
node --test test/install.test.mjs
```

Expected: all tests in `test/install.test.mjs` pass with no warnings.

- [ ] **Step 5: Verify the package**

Run:

```powershell
npm test
npm pack --dry-run
```

Expected: the complete test suite passes, and the dry-run package includes `skills/building-secure-admin-pages/SKILL.md` without adding unrelated files.

- [ ] **Step 6: Commit the implementation**

```powershell
git add -- test/install.test.mjs skills/building-secure-admin-pages/SKILL.md
git commit -m "feat: restrict concurrent admin logins"
```
