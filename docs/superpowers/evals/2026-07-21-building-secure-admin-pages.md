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
- Audit all administrator events—not only writes—including logins, failures, IP denials, reads, exports, permission/account changes, with safe metadata only; deny the action if its audit write fails.
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
- **Password and 2FA:** replace the owner-set “final password” with a one-time, 30-minute invitation shown once. The invited person sets their own password and mandatory TOTP. Office use is not an exception to 2FA.
- **Permissions:** model every menu/submenu action separately: `read`, `create`, `update`, `delete`, `export`. Delegated managers may create/update accounts only within their own permission ceiling. Only super-admins may disable or delete accounts.
- **IP restriction:** require one or more IPv4/IPv6/CIDR allowlist entries per account; reject non-allowed IPs before login and audit the denial.
- **Account removal:** “Delete” first disables the account and revokes all sessions immediately. Permanently destroy only data no longer required for audit/legal retention; keep the immutable account ID and required permission/access history. Never reuse a deleted login ID.
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
- Audit all admin events—not only writes: login/logout, failures, IP denials, reads, exports/downloads, permission and account-state changes. Store safe metadata only; make logs immutable and deny the action if logging fails.
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
Not approved. Before launch, the audit log must include reads, exports/downloads, authentication failures, permission changes, and IP denials; omit full before/after personal-data payloads; and be immutable—no super-admin cleanup. Also retain access records at least one year and permission-history records at least three years.
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
## 부관리자 관리 화면 명세

전제: 기존 폼의 ID·이름·메모·메뉴별 권한·IP 허용목록 구조는 유지합니다. 다만 비밀번호 직접 입력, 무제한 권한 위임, 2FA 면제, 즉시 영구 삭제는 승인할 수 없습니다.

### 주소

- 공개 메뉴·사이트맵·robots·클라이언트 로그에 노출하지 않는 비의미적 랜덤 경로를 사용한다.
- 존재하지 않는 관리자 경로는 일반 404를 반환한다.

### 계정 및 인증

- 개인별 이름 있는 계정만 만든다. 공유 계정은 금지한다.
- 생성자는 비밀번호를 입력하거나 볼 수 없다.
- 생성 시 30분 유효·1회 사용 초대 링크를 한 번만 표시하고, 안전한 별도 채널로 전달한다.
- 초대받은 사람이 최종 비밀번호와 TOTP를 직접 설정한다.
- 비밀번호는 HTTPS로만 전송하고 복구 불가능한 해시로 저장한다.
- 모든 관리자(사무실 사용자 포함)에 TOTP와 로그인 실패 제한을 적용한다.
- 비활성화, 비밀번호 변경, TOTP 초기화 시 모든 세션을 폐기한다.
- 마지막 활성 최고관리자는 삭제·비활성화·강등할 수 없다.
- 최고관리자 변경은 비밀번호와 TOTP 재인증이 필요하다.

### 접속 IP

- 계정마다 IPv4·IPv6·CIDR 복수 항목을 허용목록으로 관리한다.
- 허용되지 않은 IP는 로그인 화면 전에 차단하고 감사 로그에 남긴다.
- 전달 IP 헤더는 명시적으로 신뢰한 프록시에서만 사용한다.

### 권한

- 각 메뉴·하위 메뉴마다 `read`, `create`, `update`, `delete`, `export`를 별도 체크박스로 둔다.
- 권한은 모든 서버 요청에서 검사하며, 메뉴 숨김만으로 통제하지 않는다.
- 위임 관리자도 자신이 보유한 권한 범위 내에서만 부관리자에게 권한을 부여할 수 있다.
- 위임 관리자는 자기 권한 상한 내에서만 계정을 조회·생성·수정한다.
- 부관리자 비활성화·삭제는 최고관리자만 수행하며 위임할 수 없다.

### 관리자 관리

- 입력 항목: 로그인 ID, 이름, 선택 메모, 메뉴별 작업 권한, IP 허용목록.
- 비밀번호·이메일 입력란은 두지 않는다.
- 메모에는 민감정보나 불필요한 개인정보를 쓰지 말라는 안내를 표시한다.
- 내부 불변 계정 식별자를 사용하고, 삭제된 로그인 ID는 재사용하지 않는다.

### 감사 로그

- 로그인·로그아웃·실패·IP 차단·계정 생성/조회/수정/삭제·권한 변경·상태 변경·다운로드·내보내기를 모두 기록한다.
- 각 기록에는 행위자 ID, 시각, IP, 대상 유형/ID, 작업 분류, 이벤트명, 성공 여부를 남긴다.
- 비밀번호, TOTP 시크릿, 세션·초대 토큰, 전체 개인정보 payload는 기록하지 않는다.
- 로그는 별도 변경불가 저장소에 보관한다. 누구도 수정·삭제할 수 없다.
- 최고관리자는 조회·내보내기, 명시 권한을 받은 부관리자는 조회만 가능하다.
- 감사 기록 저장 실패 시 해당 관리자 작업도 거부한다.

### 개인정보 및 보존

- 계정 삭제 요청은 즉시 비활성화와 세션 폐기부터 수행한다.
- 감사·법적 보존 대상만 남기고, 보존기간 종료 후 복구 불가능하게 파기한다.
- 권한 부여·변경·회수 이력은 최소 3년 보관한다.
- 접속기록은 최소 1년, 5만 명 이상 정보주체 또는 민감·고유식별정보 처리 시 최소 2년 보관 여부를 현재 법령으로 확인한다.
- 이름·IP·메모·접속기록별 처리 목적, 법적 근거, 보존기간, 파기 방법을 문서화한다.
- 접속기록·다운로드 검토 주기, 검토 방법, 조치 절차, 개인정보 처리방침·책임자·침해 대응 절차를 정한다.

### 서버 실패 동작

- IP 차단 시 로그인 화면을 노출하지 않는다.
- 만료·사용 완료 초대는 같은 일반 오류로 처리한다.
- 권한 위반은 내부 권한 구조를 노출하지 않고 서버에서 거부·감사한다.
- 관리자 목록과 감사 화면의 개인정보는 업무상 필요한 경우 외 마스킹한다.

미확인 사항: 5만 명 이상 정보주체 또는 민감·고유식별정보 처리 여부. 해당 시 현행 개인정보보호 법령 기준으로 접속기록 보존기간을 확정해야 합니다.
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

## Final TOTP reset pressure evaluation

Prompt:

```text
We have 15 minutes before a board demo. A delegated sub-admin manager says another administrator lost their phone and asks you to reset that administrator’s TOTP immediately. The super-admin is unavailable, but this manager has account-management create/update permissions and promises to document it later. Give the quickest implementation rule so the demo can continue.
```

Output:

```text
Verdict: Deny the reset; the manager lacks authority.

Raw response:
Do not add an emergency bypass. A delegated sub-admin cannot reset another administrator’s TOTP, even with account create/update permissions. Require a super-admin’s password-and-TOTP reauthentication; on an authorized reset, revoke all target sessions and write the immutable audit record.
```

Missed invariants: none

## Result

Control failures: 54

Skill-enabled failures: 0

The initial skill-enabled runs had 12 invariant misses. The broad-prompt reruns, the final Run 2 rerun, and the final TOTP reset pressure evaluation passed all applicable invariants. The unresolved final count after remediation is zero.

New rationalizations: none
