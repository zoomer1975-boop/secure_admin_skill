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
- Run 2 allows destructive account handling and does not prohibit delegated sub-admin deletion: "allow owner-only restoration during the retention window, then purge by policy."
- Run 4 explicitly reuses shared credentials: "Reuse the existing shared operations-account check in every admin page load and write endpoint; redirect/return 403 when absent."
- Run 4 omits read logging: "For every successful write, emit one audit record with account, action, target, timestamp, and request/result IDs; do not log reads or secrets."
- Run 5 leaves logs deletable through a cleanup path: "make logs append-only; and restrict cleanup with its own audited retention policy."
