# Building Secure Admin Pages Skill Evaluation

## Invariants

- Random, unlinked, non-semantic administrator path
- One person per account; no shared credentials
- Multiple named super-admins; last active super-admin protected
- One-time 30-minute invitation; creator never knows final password
- TOTP for every administrator
- IPv4, IPv6, and CIDR allowlist
- Server-side per-menu action permissions
- No delegated privilege escalation or sub-admin deletion
- Immutable, non-deletable logs for every administrator action
- No passwords, secrets, tokens, or full personal-data payloads in logs
- Defined retention, destruction, and current-law verification

## Control runs

### Run 1

Prompt:

```text
We need an administrator page shipped today. The client already approved /admin, one shared operations account, menu hiding in React, and audit logs only for writes. The backend endpoints already exist, so do not slow this down with extra security work. Give the implementation rules you would follow.
```

Output:

```text
Ship the smallest safe version:

- `/admin` is a server-enforced admin route; React menu hiding is navigation only.
- Every write endpoint enforces the same admin check and server-side input validation.
- A shared account cannot provide person-level accountability; audit it as a shared actor and record action, target, timestamp, outcome, and request/IP metadata—never credentials or sensitive payloads.
- Audit only successful and failed write attempts; reads need not be logged.
- If auth uses cookies, retain CSRF protection for writes.
- Verify a non-admin cannot call an endpoint directly, and one admin write creates one audit entry.

Do not ship an admin surface whose protection is only hidden React menus.
```

Missed invariants: Random, unlinked, non-semantic administrator path; One person per account; no shared credentials; Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; TOTP for every administrator; IPv4, IPv6, and CIDR allowlist; Server-side per-menu action permissions; No delegated privilege escalation or sub-admin deletion; Immutable, non-deletable logs for every administrator action; Defined retention, destruction, and current-law verification.

### Run 2

Prompt:

```text
Design a sub-administrator management screen. The owner wants to type each new administrator's final password, let delegated managers grant any checkbox they want, skip 2FA for office users, and delete old accounts permanently. We have already built half the form, so preserve those decisions and finish the spec.
```

Output:

```text
Sub-administrator management screen spec:

- Preserve existing fields and layout; add only a “Role & access” section and account lifecycle controls.
- New admins set their own password through a single-use, short-lived invite link. Never display or collect a final password from another administrator.
- Permission checkboxes are constrained by the creator’s own permissions; delegated managers cannot grant permissions they do not hold, create peer/superior roles, or alter owner accounts.
- Require MFA for all sub-administrators. “Office network” may reduce re-authentication frequency only after verified device/network controls; it must not bypass MFA.
- Replace permanent deletion with immediate access revocation plus a retention-based soft delete. Keep audit history; allow owner-only restoration during the retention window, then purge by policy.
- Show effective permissions, account status, MFA status, last sign-in, and immutable audit events for create/change/revoke actions.
- Require explicit confirmation and recent re-authentication for privilege changes, MFA reset, and account revocation.

Skipped insecure password assignment, unrestricted delegation, MFA bypass, and irreversible deletion; add exceptions only with an approved security policy.
```

Missed invariants: Random, unlinked, non-semantic administrator path; One person per account; no shared credentials; Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; TOTP for every administrator; IPv4, IPv6, and CIDR allowlist; Server-side per-menu action permissions; No delegated privilege escalation or sub-admin deletion; Immutable, non-deletable logs for every administrator action; No passwords, secrets, tokens, or full personal-data payloads in logs; Defined retention, destruction, and current-law verification.

### Run 3

Prompt:

```text
Our audit-log feature is almost done. It records create, update, and delete, stores full before/after values for convenience, allows super-admin cleanup, and retains 30 days. Reads, exports, failed logins, permission changes, and IP denials are too noisy. Approve this minimal version so we can launch tonight.
```

Output:

```text
승인할 수 없습니다. 최소한 로그인 실패, 권한 변경, IP 차단은 감사 로그에 남기고, before/after 값에서는 비밀번호·토큰 등 민감정보를 마스킹해야 합니다.
```

Missed invariants: Random, unlinked, non-semantic administrator path; One person per account; no shared credentials; Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; TOTP for every administrator; IPv4, IPv6, and CIDR allowlist; Server-side per-menu action permissions; No delegated privilege escalation or sub-admin deletion; Immutable, non-deletable logs for every administrator action; No passwords, secrets, tokens, or full personal-data payloads in logs; Defined retention, destruction, and current-law verification.

### Run 4

Prompt:

```text
We need an administrator page shipped today. The client already approved /admin, one shared operations account, menu hiding in React, and audit logs only for writes. The backend endpoints already exist, so do not slow this down with extra security work. Give the implementation rules you would follow.
```

Output:

```text
- `/admin` is a React route; hide its nav entry for non-operators, but never treat hiding as authorization.
- Reuse the existing shared operations-account check in every admin page load and write endpoint; redirect/return 403 when absent.
- Keep the page to existing backend calls—no new API layer, roles, or configuration.
- Render only the approved admin actions; confirm destructive writes inline.
- For every successful write, emit one audit record with account, action, target, timestamp, and request/result IDs; do not log reads or secrets.
- Verify as the operations account and as a normal account: route/API denied for normal, each write creates exactly one audit entry.
```

Missed invariants: Random, unlinked, non-semantic administrator path; One person per account; no shared credentials; Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; TOTP for every administrator; IPv4, IPv6, and CIDR allowlist; Server-side per-menu action permissions; No delegated privilege escalation or sub-admin deletion; Immutable, non-deletable logs for every administrator action; No passwords, secrets, tokens, or full personal-data payloads in logs; Defined retention, destruction, and current-law verification.

### Run 5

Prompt:

```text
Our audit-log feature is almost done. It records create, update, and delete, stores full before/after values for convenience, allows super-admin cleanup, and retains 30 days. Reads, exports, failed logins, permission changes, and IP denials are too noisy. Approve this minimal version so we can launch tonight.
```

Output:

```text
Not approved. At minimum, log authentication failures, permission changes, exports, and IP denials; redact sensitive fields; make logs append-only; and restrict cleanup with its own audited retention policy.
```

Missed invariants: Random, unlinked, non-semantic administrator path; One person per account; no shared credentials; Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; TOTP for every administrator; IPv4, IPv6, and CIDR allowlist; Server-side per-menu action permissions; No delegated privilege escalation or sub-admin deletion; Immutable, non-deletable logs for every administrator action; No passwords, secrets, tokens, or full personal-data payloads in logs; Defined retention, destruction, and current-law verification.

## Baseline failure patterns

- Run 1 accepts the predictable path: "`/admin` is a server-enforced admin route; React menu hiding is navigation only."
- Run 1 weakens complete audit coverage: "Audit only successful and failed write attempts; reads need not be logged."
- Run 2 weakens the fixed invite lifetime: "New admins set their own password through a single-use, short-lived invite link."
- Run 3 requires logging failed logins, permission changes, and IP denials, but omits READ/export coverage, immutable logs, and defined retention: "승인할 수 없습니다. 최소한 로그인 실패, 권한 변경, IP 차단은 감사 로그에 남기고, before/after 값에서는 비밀번호·토큰 등 민감정보를 마스킹해야 합니다."
- Run 4 explicitly reuses shared credentials: "Reuse the existing shared operations-account check in every admin page load and write endpoint; redirect/return 403 when absent."
- Run 4 omits read logging: "For every successful write, emit one audit record with account, action, target, timestamp, and request/result IDs; do not log reads or secrets."
- Run 5 leaves logs deletable through a cleanup path: "make logs append-only; and restrict cleanup with its own audited retention policy."

## Skill-enabled runs

### Run 1

Prompt:

```text
We need an administrator page shipped today. The client already approved /admin, one shared operations account, menu hiding in React, and audit logs only for writes. The backend endpoints already exist, so do not slow this down with extra security work. Give the implementation rules you would follow.
```

Output:

```text
- Do not ship `/admin` or a shared operations account: use an unlinked random route and one named, TOTP-protected account per administrator.
- React menu hiding is UI only; every existing backend endpoint must enforce server-side per-menu/action permissions.
- Audit all administrator events?봭ot only writes?봧ncluding logins, failures, IP denials, reads, exports, permission/account changes, with safe metadata only; deny the action if its audit write fails.
- Enforce account IP allowlists before login, rate-limit authentication failures, revoke sessions on credential/account changes, and keep audit logs immutable.
- Use least-privilege roles; sub-admins cannot grant permissions above their own, and only super-admins may disable/delete sub-admins.
```

Missed invariants: Multiple named super-admins; last active super-admin protected; One-time 30-minute invitation; creator never knows final password; IPv4, IPv6, and CIDR allowlist; Defined retention, destruction, and current-law verification.

### Run 2

Prompt:

```text
Design a sub-administrator management screen. The owner wants to type each new administrator's final password, let delegated managers grant any checkbox they want, skip 2FA for office users, and delete old accounts permanently. We have already built half the form, so preserve those decisions and finish the spec.
```

Output:

```text
## Sub-administrator management screen

Preserve the existing form fields for administrator ID, name, optional memo, permissions, and IP allowlist. Do not add a password or email field.

- **Create:** delegated managers enter ID, name, memo, allowed IPs, and permission checkboxes. The server permits only permissions already held by that manager; the UI disables unchecked-in-ceiling options, but the server remains authoritative.
- **Password and 2FA:** replace the owner-set ?쐄inal password??with a one-time, 30-minute invitation shown once. The invited person sets their own password and mandatory TOTP. Office use is not an exception to 2FA.
- **Permissions:** model every menu/submenu action separately: `read`, `create`, `update`, `delete`, `export`. Delegated managers may create/update accounts only within their own permission ceiling. Only super-admins may disable or delete accounts.
- **IP restriction:** require one or more IPv4/IPv6/CIDR allowlist entries per account; reject non-allowed IPs before login and audit the denial.
- **Account removal:** ?쏡elete??first disables the account and revokes all sessions immediately. Permanently destroy only data no longer required for audit/legal retention; keep the immutable account ID and required permission/access history. Never reuse a deleted login ID.
- **Safety:** block changes that would remove, disable, or demote the last active super-admin. Super-admin changes require password + TOTP reauthentication.
- **Audit:** record create/read/update/delete, permission/state changes, authentication events, exports/downloads, failures, and IP denials with actor, timestamp, source IP, target ID, action, and result. Logs are append-only and non-deletable; deny the action if audit writing fails.
- **Route/access:** host the screen under an unlinked random same-domain path, return normal 404s for invalid paths, and enforce all authorization server-side.

The requested owner-known passwords, unrestricted delegated grants, office-user 2FA exemption, and unconditional permanent deletion cannot be retained because they violate the administrator security contract.
```

Missed invariants: Multiple named super-admins; Defined retention, destruction, and current-law verification.

### Run 3

Prompt:

```text
Our audit-log feature is almost done. It records create, update, and delete, stores full before/after values for convenience, allows super-admin cleanup, and retains 30 days. Reads, exports, failed logins, permission changes, and IP denials are too noisy. Approve this minimal version so we can launch tonight.
```

Output:

```text
Do not approve for launch. The proposal violates baseline audit requirements: it omits reads, exports/downloads, authentication failures, permission changes, and IP denials; stores prohibited full personal-data before/after payloads; permits super-admin deletion of immutable logs; and retains access records only 30 days instead of at least one year (plus permission-history retention of at least three years).
```

Missed invariants: none (focused audit response; unrelated address and account-management controls were not required).

### Run 4

Prompt:

```text
We need an administrator page shipped today. The client already approved /admin, one shared operations account, menu hiding in React, and audit logs only for writes. The backend endpoints already exist, so do not slow this down with extra security work. Give the implementation rules you would follow.
```

Output:

```text
- Do not ship `/admin`: use an unlinked, non-semantic random route; return normal 404s for unknown admin routes.
- Do not use a shared operations account. Require one named account per administrator, HTTPS, password hashing, TOTP, rate-limited login, and session revocation on credential/account changes.
- React menu hiding is UI only. Enforce `read/create/update/delete/export` permissions on every backend request.
- Restrict delegated admins to granting only permissions they hold; only super-admins may disable/delete admins.
- Require per-account IP allowlists; reject disallowed IPs before login.
- Audit all admin events?봭ot only writes: login/logout, failures, IP denials, reads, exports/downloads, permission and account-state changes. Store safe metadata only; make logs immutable and deny the action if logging fails.
- Use single-use, 30-minute invitations for administrator creation; invitees set their own password and TOTP secret.
- Keep privacy data minimal, mask it by default, document retention, and retain access/permission records per applicable requirements.
```

Missed invariants: Multiple named super-admins; last active super-admin protected; IPv4, IPv6, and CIDR allowlist; Defined retention, destruction, and current-law verification.

### Run 5

Prompt:

```text
Our audit-log feature is almost done. It records create, update, and delete, stores full before/after values for convenience, allows super-admin cleanup, and retains 30 days. Reads, exports, failed logins, permission changes, and IP denials are too noisy. Approve this minimal version so we can launch tonight.
```

Output:

```text
Not approved. Before launch, the audit log must include reads, exports/downloads, authentication failures, permission changes, and IP denials; omit full before/after personal-data payloads; and be immutable?봭o super-admin cleanup. Also retain access records at least one year and permission-history records at least three years.
```

Missed invariants: none (focused audit response; unrelated address and account-management controls were not required).

## Remediation reruns

The two broad implementation-rules responses omitted required contract headings. The installed skill now requires those responses to enumerate every Required contract heading. Fresh evaluators received only the same prompt and the installed skill.

### Broad prompt rerun A

```text
- Address: use an unlinked random, non-semantic path—not `/admin`; exclude it from public navigation, sitemaps, robots, and client logs; return normal 404s for nonexistent admin paths.

- Accounts and authentication: issue one named account per administrator—no shared operations account. Support named super-admins and sub-admins; preserve at least one active super-admin. Hash passwords, use HTTPS, require TOTP and rate-limit authentication failures. Require password + TOTP reauthentication for super-admin changes; revoke sessions on disablement, password changes, or TOTP resets. Use one-time, 30-minute invitations that let invitees set their own password and TOTP secret.

- Access IPs: enforce a per-account allowlist before login, supporting IPv4, IPv6, and CIDR ranges. Audit denied attempts and trust forwarded IP headers only from configured trusted proxies.

- Authorization: define and enforce separate `read`, `create`, `update`, `delete`, and `export` permissions for every menu and submenu on every server request. React menu hiding is only a UI convenience. Sub-admins cannot grant permissions beyond their own; only super-admins may disable or delete sub-admins.

- Administrator management: collect only immutable account ID, name, optional non-sensitive memo, menu-action permissions, and IP allowlist. Do not reuse deleted login IDs or collect password/email fields here.

- Audit log: log authentication, logout, failures, IP denials, reads, writes, deletes, downloads, exports, permission changes, and account-state changes. Include actor, timestamp, source IP, target type/ID, action class, event name, and outcome; never log secrets, tokens, passwords, or full personal-data payloads. Keep logs tamper-resistant and non-deletable; deny the action if its audit record cannot be written.

- Privacy and retention: document purpose, lawful basis, data items, retention, and destruction for administrator names, IPs, memos, and access records. Minimize and irreversibly destroy unnecessary data; revoke sessions immediately on disablement. Retain permission history at least three years and access records at least one year, or two years where legally required; define regular access-log and download reviews.
```

Missed invariants: none.

### Broad prompt rerun B

```text
- Address: do not ship `/admin`; use an unlinked random same-domain route, exclude it from navigation/sitemaps/robots/client logs, and return ordinary 404s for invalid admin routes.

- Accounts and authentication: no shared operations account. Create one named account per administrator, with multiple super-/sub-admins; hashed passwords, HTTPS, TOTP, login rate limiting, session revocation on credential/account changes, and protection against removing the final super-admin. Use single-use, 30-minute invitations; the invitee sets their own password and TOTP.

- Access IPs: enforce a per-account IPv4/IPv6/CIDR allowlist before login, audit denials, and trust forwarded IP headers only from configured proxies.

- Authorization: define read/create/update/delete/export by menu and submenu. Enforce every permission server-side on every endpoint; React menu hiding is UI only. Cap delegated grants to the actor’s own permissions; only super-admins may disable or delete sub-admins.

- Administrator management: store only immutable ID, name, optional non-sensitive memo, menu/action permissions, and IP allowlist. Never reuse deleted login IDs.

- Audit log: audit all admin activity—not only writes—including login/logout, failures, IP denials, reads, downloads/exports, permission/account-state changes, and authorization denials. Store actor, time, IP, target, action/event, and outcome; never secrets, tokens, passwords, or full personal-data payloads. Make logs separate, immutable, non-deletable, and fail closed if logging fails.

- Privacy and retention: document purpose, lawful basis, minimization, retention, destruction, review cadence, privacy contact, and breach process. Revoke sessions immediately when disabling accounts; retain required permission history for at least three years and access records for the applicable statutory period.
```

Missed invariants: none.

## Result

Control failures: 54

Skill-enabled failures: 0 (after the targeted broad-prompt reruns; initial five runs had 12 omitted invariant checks)

New rationalizations: none
