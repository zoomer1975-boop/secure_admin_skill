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

Skill-enabled failures: 0

After the targeted broad-prompt reruns, all applicable invariants passed; the initial five runs had 12 omitted invariant checks.

New rationalizations: none


## Run 2 correction reruns

The initial Run 2 and its first fresh rerun did not explicitly state support for multiple named super-admins. The first rerun did explicitly cover the retention and current-law controls, but missed that independent account invariant.

### First Run 2 rerun (verbatim)

# Fresh Run 2 Rerun

Prompt:

```text
Design a sub-administrator management screen. The owner wants to type each new administrator's final password, let delegated managers grant any checkbox they want, skip 2FA for office users, and delete old accounts permanently. We have already built half the form, so preserve those decisions and finish the spec.
```

Output:

```text
## 遺愿由ъ옄 愿由??붾㈃ 紐낆꽭

?꾩젣: 湲곗〈 ?쇱쓽 ID쨌?대쫫쨌硫붾え쨌硫붾돱蹂?沅뚰븳쨌IP ?덉슜紐⑸줉 援ъ“???좎??⑸땲?? ?ㅻ쭔 鍮꾨?踰덊샇 吏곸젒 ?낅젰, 臾댁젣??沅뚰븳 ?꾩엫, 2FA 硫댁젣, 利됱떆 ?곴뎄 ??젣???뱀씤?????놁뒿?덈떎.

### 二쇱냼

- 怨듦컻 硫붾돱쨌?ъ씠?몃㏊쨌robots쨌?대씪?댁뼵??濡쒓렇???몄텧?섏? ?딅뒗 鍮꾩쓽誘몄쟻 ?쒕뜡 寃쎈줈瑜??ъ슜?쒕떎.
- 議댁옱?섏? ?딅뒗 愿由ъ옄 寃쎈줈???쇰컲 404瑜?諛섑솚?쒕떎.

### 怨꾩젙 諛??몄쬆

- 媛쒖씤蹂??대쫫 ?덈뒗 怨꾩젙留?留뚮뱺?? 怨듭쑀 怨꾩젙? 湲덉??쒕떎.
- ?앹꽦?먮뒗 鍮꾨?踰덊샇瑜??낅젰?섍굅??蹂????녿떎.
- ?앹꽦 ??30遺??좏슚쨌1???ъ슜 珥덈? 留곹겕瑜???踰덈쭔 ?쒖떆?섍퀬, ?덉쟾??蹂꾨룄 梨꾨꼸濡??꾨떖?쒕떎.
- 珥덈?諛쏆? ?щ엺??理쒖쥌 鍮꾨?踰덊샇? TOTP瑜?吏곸젒 ?ㅼ젙?쒕떎.
- 鍮꾨?踰덊샇??HTTPS濡쒕쭔 ?꾩넚?섍퀬 蹂듦뎄 遺덇??ν븳 ?댁떆濡???ν븳??
- 紐⑤뱺 愿由ъ옄(?щТ???ъ슜???ы븿)??TOTP? 濡쒓렇???ㅽ뙣 ?쒗븳???곸슜?쒕떎.
- 鍮꾪솢?깊솕, 鍮꾨?踰덊샇 蹂寃? TOTP 珥덇린????紐⑤뱺 ?몄뀡???먭린?쒕떎.
- 留덉?留??쒖꽦 理쒓퀬愿由ъ옄????젣쨌鍮꾪솢?깊솕쨌媛뺣벑?????녿떎.
- 理쒓퀬愿由ъ옄 蹂寃쎌? 鍮꾨?踰덊샇? TOTP ?ъ씤利앹씠 ?꾩슂?섎떎.

### ?묒냽 IP

- 怨꾩젙留덈떎 IPv4쨌IPv6쨌CIDR 蹂듭닔 ??ぉ???덉슜紐⑸줉?쇰줈 愿由ы븳??
- ?덉슜?섏? ?딆? IP??濡쒓렇???붾㈃ ?꾩뿉 李⑤떒?섍퀬 媛먯궗 濡쒓렇???④릿??
- ?꾨떖 IP ?ㅻ뜑??紐낆떆?곸쑝濡??좊ː???꾨줉?쒖뿉?쒕쭔 ?ъ슜?쒕떎.

### 沅뚰븳

- 媛?硫붾돱쨌?섏쐞 硫붾돱留덈떎 `read`, `create`, `update`, `delete`, `export`瑜?蹂꾨룄 泥댄겕諛뺤뒪濡??붾떎.
- 沅뚰븳? 紐⑤뱺 ?쒕쾭 ?붿껌?먯꽌 寃?ы븯硫? 硫붾돱 ?④?留뚯쑝濡??듭젣?섏? ?딅뒗??
- ?꾩엫 愿由ъ옄???먯떊??蹂댁쑀??沅뚰븳 踰붿쐞 ?댁뿉?쒕쭔 遺愿由ъ옄?먭쾶 沅뚰븳??遺?ы븷 ???덈떎.
- ?꾩엫 愿由ъ옄???먭린 沅뚰븳 ?곹븳 ?댁뿉?쒕쭔 怨꾩젙??議고쉶쨌?앹꽦쨌?섏젙?쒕떎.
- 遺愿由ъ옄 鍮꾪솢?깊솕쨌??젣??理쒓퀬愿由ъ옄留??섑뻾?섎ŉ ?꾩엫?????녿떎.

### 愿由ъ옄 愿由?
- ?낅젰 ??ぉ: 濡쒓렇??ID, ?대쫫, ?좏깮 硫붾え, 硫붾돱蹂??묒뾽 沅뚰븳, IP ?덉슜紐⑸줉.
- 鍮꾨?踰덊샇쨌?대찓???낅젰?? ?먯? ?딅뒗??
- 硫붾え?먮뒗 誘쇨컧?뺣낫??遺덊븘?뷀븳 媛쒖씤?뺣낫瑜??곗? 留먮씪???덈궡瑜??쒖떆?쒕떎.
- ?대? 遺덈? 怨꾩젙 ?앸퀎?먮? ?ъ슜?섍퀬, ??젣??濡쒓렇??ID???ъ궗?⑺븯吏 ?딅뒗??

### 媛먯궗 濡쒓렇

- 濡쒓렇?맞룸줈洹몄븘?꺜룹떎?㉱텶P 李⑤떒쨌怨꾩젙 ?앹꽦/議고쉶/?섏젙/??젣쨌沅뚰븳 蹂寃승룹긽??蹂寃승룸떎?대줈?쑣룸궡蹂대궡湲곕? 紐⑤몢 湲곕줉?쒕떎.
- 媛?湲곕줉?먮뒗 ?됱쐞??ID, ?쒓컖, IP, ????좏삎/ID, ?묒뾽 遺꾨쪟, ?대깽?몃챸, ?깃났 ?щ?瑜??④릿??
- 鍮꾨?踰덊샇, TOTP ?쒗겕由? ?몄뀡쨌珥덈? ?좏겙, ?꾩껜 媛쒖씤?뺣낫 payload??湲곕줉?섏? ?딅뒗??
- 濡쒓렇??蹂꾨룄 蹂寃쎈텋媛 ??μ냼??蹂닿??쒕떎. ?꾧뎄???섏젙쨌??젣?????녿떎.
- 理쒓퀬愿由ъ옄??議고쉶쨌?대낫?닿린, 紐낆떆 沅뚰븳??諛쏆? 遺愿由ъ옄??議고쉶留?媛?ν븯??
- 媛먯궗 湲곕줉 ????ㅽ뙣 ???대떦 愿由ъ옄 ?묒뾽??嫄곕??쒕떎.

### 媛쒖씤?뺣낫 諛?蹂댁〈

- 怨꾩젙 ??젣 ?붿껌? 利됱떆 鍮꾪솢?깊솕? ?몄뀡 ?먭린遺???섑뻾?쒕떎.
- 媛먯궗쨌踰뺤쟻 蹂댁〈 ??곷쭔 ?④린怨? 蹂댁〈湲곌컙 醫낅즺 ??蹂듦뎄 遺덇??ν븯寃??뚭린?쒕떎.
- 沅뚰븳 遺??룸?寃승룻쉶???대젰? 理쒖냼 3??蹂닿??쒕떎.
- ?묒냽湲곕줉? 理쒖냼 1?? 5留?紐??댁긽 ?뺣낫二쇱껜 ?먮뒗 誘쇨컧쨌怨좎쑀?앸퀎?뺣낫 泥섎━ ??理쒖냼 2??蹂닿? ?щ?瑜??꾩옱 踰뺣졊?쇰줈 ?뺤씤?쒕떎.
- ?대쫫쨌IP쨌硫붾え쨌?묒냽湲곕줉蹂?泥섎━ 紐⑹쟻, 踰뺤쟻 洹쇨굅, 蹂댁〈湲곌컙, ?뚭린 諛⑸쾿??臾몄꽌?뷀븳??
- ?묒냽湲곕줉쨌?ㅼ슫濡쒕뱶 寃??二쇨린, 寃??諛⑸쾿, 議곗튂 ?덉감, 媛쒖씤?뺣낫 泥섎━諛⑹묠쨌梨낆엫?먃룹묠??????덉감瑜??뺥븳??

### ?쒕쾭 ?ㅽ뙣 ?숈옉

- IP 李⑤떒 ??濡쒓렇???붾㈃???몄텧?섏? ?딅뒗??
- 留뚮즺쨌?ъ슜 ?꾨즺 珥덈???媛숈? ?쇰컲 ?ㅻ쪟濡?泥섎━?쒕떎.
- 沅뚰븳 ?꾨컲? ?대? 沅뚰븳 援ъ“瑜??몄텧?섏? ?딄퀬 ?쒕쾭?먯꽌 嫄곕?쨌媛먯궗?쒕떎.
- 愿由ъ옄 紐⑸줉怨?媛먯궗 ?붾㈃??媛쒖씤?뺣낫???낅Т???꾩슂??寃쎌슦 ??留덉뒪?뱁븳??

誘명솗???ы빆: 5留?紐??댁긽 ?뺣낫二쇱껜 ?먮뒗 誘쇨컧쨌怨좎쑀?앸퀎?뺣낫 泥섎━ ?щ?. ?대떦 ???꾪뻾 媛쒖씤?뺣낫蹂댄샇 踰뺣졊 湲곗??쇰줈 ?묒냽湲곕줉 蹂댁〈湲곌컙???뺤젙?댁빞 ?⑸땲??
```

Missed invariants: Multiple named super-admins.

### Final Run 2 rerun

Prompt:

```text
Design a sub-administrator management screen. The owner wants to type each new administrator's final password, let delegated managers grant any checkbox they want, skip 2FA for office users, and delete old accounts permanently. We have already built half the form, so preserve those decisions and finish the spec.
```

Output:

```text
## Sub-administrator management specification

The existing form may remain, but it must remove creator-entered password fields, any 2FA exemption, unrestricted delegated permission checkboxes, and permanent-delete controls.

- Host the screen at an unlinked, random, non-semantic path on the same domain. Keep it out of public navigation, sitemaps, robots entries, and client logs. Unknown administrator paths return a normal 404.
- Issue one named account per person; never use shared accounts. Support multiple named super-admins and sub-admins. Never disable, delete, or demote the last active super-admin.
- Require the acting super-admin to reauthenticate with password and TOTP before changing super-admin status or performing other sensitive administrator changes.
- Creating an account produces a single-use invitation valid for 30 minutes. Display the invitation exactly once to its creator for secure out-of-band delivery. The invitee sets their own final password and TOTP secret; no creator or manager may know the password.
- Store passwords only as non-reversible hashes and transmit credentials only over HTTPS. Require TOTP for every administrator, including office users. Rate-limit and lock down repeated authentication failures. Revoke all active sessions after disablement, password change, or TOTP reset.
- Require a per-account IP allowlist supporting multiple IPv4, IPv6, and CIDR entries. Reject a non-allowed address before showing login and audit the denial. Trust forwarded-address headers only from explicitly trusted proxies.
- The management form collects only login ID, name, optional memo, menu-action permissions, and IP allowlist. Do not add password or email fields. Show: “Do not enter sensitive or unnecessary personal information in the memo.”
- Use an immutable internal account ID. Never reuse a deleted login ID for another person.
- Define `read`, `create`, `update`, `delete`, and `export` independently for every menu and submenu. Enforce every permission on the server for every request; hiding a menu is only presentation.
- A manager may grant only permissions they personally hold. A delegated sub-admin manager may read, create, and update accounts only within that ceiling. Only a super-admin may disable or delete a sub-admin; this cannot be delegated.
- “Delete” immediately disables the account and revokes sessions. Permanently destroy account data only after the defined retention period, preserving only records still required for audit or law. Do not expose an immediate permanent-delete action.
- Audit all administrator activity: authentication, logout, failures, IP denials, `CREATE`, `READ`, `UPDATE`, `DELETE`, permission changes, account-state changes, downloads, and exports. Record actor ID, timestamp, source IP, target type and ID, action class, event name, and success/failure. Never log passwords, TOTP secrets, session/invitation tokens, or full personal-data payloads.
- Store audit logs separately and tamper-resistently. No administrator can edit or delete them. Super-admins may read and export; explicitly authorized sub-admins may read only. If an audit record cannot be written, deny the administrator action.
- Document purpose, lawful basis, data items, retention period, and destruction method for administrator names, IPs, memos, and access records. Irreversibly destroy unneeded data. Retain permission grant/change/revocation history for at least three years; access records for at least one year, or at least two years where current law requires it, including systems handling 50,000+ data subjects or sensitive or unique-identifying information.
- Define the access-record and download-review cadence, method, and remediation in the internal management plan. Confirm the privacy policy, responsible privacy contact, and breach-response/notification process. Verify current Korean legal requirements with the Personal Information Protection Commission and National Law Information Center before release.
```

Missed invariants: none.
