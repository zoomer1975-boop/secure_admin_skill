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
- Only an acting super-admin freshly reauthenticated with password and TOTP may reset another administrator's TOTP; revoke all target-account sessions after the reset.
- Enforce one password policy server-side before hashing or storage on invitation completion, password changes, and resets:
  - Require at least 10 characters with at least one uppercase letter, one lowercase letter, one digit, and one ASCII special character other than whitespace.
  - Normalize the password, login ID, and name with Unicode NFKC, case-folding, and whitespace removal. Reject a password containing the full normalized ID or name, any contiguous three-character substring of either, or the full value when either is one or two characters long.
  - Reject the same character repeated three or more times consecutively (three or more consecutive characters) and ascending or descending digit sequences of three or more digits.
  - On failure, identify the unmet rules without echoing or recording the password and leave the account, invitation, and stored hash unchanged.
- During invitation setup, show the invitee three labeled QR codes: the official iOS App Store installation QR, the official Android Google Play installation QR, and one account-specific `otpauth://totp/` QR shared by both platforms. Include direct, clickable official store links without shorteners, redirects, or tracking parameters; do not add device detection.
- Generate the TOTP QR locally or on the application server. Never send the TOTP secret or provisioning URI to an external QR-generation service, cache, log, analytics event, or client-side storage; return it with `Cache-Control: no-store`, encrypt the secret at rest, and never expose it to the inviting administrator.
- Put matching URL-encoded issuer values in the TOTP label and `issuer` parameter and encode the secret with Base32. Reuse project TOTP settings or default to SHA-1, six digits, and a 30-second period for Google Authenticator compatibility.
- Activate the account only after the invitee submits a valid six-digit TOTP code. Apply the existing repeated-failure restriction, destroy unfinished secrets when invitations expire, and never redisplay the provisioning QR after setup succeeds.

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

For a full implementation or specification response, state every Required contract bullet explicitly; one safeguard does not imply another (for example, protect the last active super-admin and also support multiple named super-admins).

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
