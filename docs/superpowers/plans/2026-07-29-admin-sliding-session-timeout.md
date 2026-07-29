# Admin Sliding Session Timeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mandatory 10-minute sliding inactivity timeout to the installed secure-admin Skill without an absolute session lifetime or cumulative extension.

**Architecture:** Extend the existing `Accounts and authentication` contract in `SKILL.md`; no installer or runtime code changes are needed because the package copies that file unchanged. Pin every part of the contract in the existing installer integration test so an incomplete future edit fails.

**Tech Stack:** Markdown Skill contract, Node.js 18+, built-in `node:test` and `node:assert`.

## Global Constraints

- Keep one server-enforced inactivity timer: expiry is the current valid administrator activity time plus 10 minutes.
- Replace the expiry on activity; never add time to the existing expiry and do not impose a first-login-based absolute cap.
- Count only user-initiated, authenticated, and authorized administrator business requests as activity.
- Automatic refreshes, background polling, heartbeats, and client-side mouse or keyboard events are not activity.
- Expiry invalidates the server session, prevents further data exchange, disables automatic renewal or login, and requires the initial password and TOTP authentication flow.
- Record the automatic logout without recording the session token, and require the policy in the internal management plan.
- Do not change the README, installer, package structure, or any existing security contract.
- Add no dependency or new abstraction.

---

### Task 1: Pin and add the session contract

**Files:**
- Modify: `test/install.test.mjs:48-74`
- Modify: `skills/building-secure-admin-pages/SKILL.md:28-47`

**Interfaces:**
- Consumes: the existing installer behavior that copies `skills/building-secure-admin-pages/SKILL.md` into the target Skill directory.
- Produces: required English contract text in the installed `SKILL.md`, verified by the existing `installs the complete skill for Codex` integration test.

- [ ] **Step 1: Write the failing test**

Add these expressions to the requirement array in `test/install.test.mjs`:

```js
    /Expire every administrator session after 10 minutes without valid administrator activity/,
    /replace the expiry with 10 minutes from the current activity.*Never add time to the existing expiry.*Do not impose an absolute session lifetime/,
    /Only user-initiated, authenticated, and authorized administrator read, create, update, delete, download, or export requests count as activity/,
    /Automatic refreshes, background polling, heartbeats, and client-side mouse or keyboard events do not count as activity/,
    /invalidate the session on the server.*prevent further data exchange.*same password and TOTP authentication used for the initial login/,
    /Record the automatic logout without recording the session token.*internal management plan/,
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
node --test test/install.test.mjs
```

Expected: `installs the complete skill for Codex` fails with `The input did not match the regular expression` for the first new session requirement.

- [ ] **Step 3: Add the minimal Skill contract**

Insert the following bullets in `skills/building-secure-admin-pages/SKILL.md` immediately after the existing session-revocation requirement:

```markdown
- Expire every administrator session after 10 minutes without valid administrator activity. On each valid activity, replace the expiry with 10 minutes from the current activity. Never add time to the existing expiry. Do not impose an absolute session lifetime based on the initial login.
- Only user-initiated, authenticated, and authorized administrator read, create, update, delete, download, or export requests count as activity. Automatic refreshes, background polling, heartbeats, and client-side mouse or keyboard events do not count as activity.
- On expiry, invalidate the session on the server, prevent further data exchange, and prohibit automatic renewal or login. Require the same password and TOTP authentication used for the initial login before restoring access; a screen lock or login-page redirect alone is not session invalidation.
- Record the automatic logout without recording the session token. Require the 10-minute limit, activity definition, server-side invalidation, and reauthentication procedure in the internal management plan.
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
git commit -m "feat: add sliding admin session timeout"
```
