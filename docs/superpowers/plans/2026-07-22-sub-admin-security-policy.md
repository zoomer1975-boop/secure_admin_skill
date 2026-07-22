# Sub-Admin Security Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 부관리자 비밀번호 정책과 Google Authenticator QR 등록 규칙을 배포 가능한 관리자 스킬에 추가한다.

**Architecture:** 기존 `Accounts and authentication` 계약에 서버 측 비밀번호 검증과 세 QR의 TOTP 등록 규칙을 직접 추가한다. 새 파일이나 의존성 없이 기존 설치 테스트가 배포된 `SKILL.md`의 핵심 문구를 확인하게 한다.

**Tech Stack:** Markdown Agent Skill, Node.js 18+, `node:test`

## Global Constraints

- 관리자 등록자는 최종 비밀번호와 TOTP 비밀키를 알 수 없다.
- 비밀번호 정책은 초대 완료, 변경, 재설정에서 서버가 저장 전에 동일하게 강제한다.
- iOS와 Android 공식 설치 QR 및 계정별 공통 TOTP QR을 제공한다.
- TOTP 비밀키를 외부 QR 서비스, 캐시, 로그, 분석 이벤트에 노출하지 않는다.
- `skills/building-secure-admin-pages/SKILL.md`와 `test/install.test.mjs` 외의 구현 파일은 수정하지 않는다.

---

### Task 1: 비밀번호 및 TOTP QR 계약 배포

**Files:**
- Modify: `test/install.test.mjs`
- Modify: `skills/building-secure-admin-pages/SKILL.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-22-sub-admin-password-policy-design.md`
- Produces: 설치된 `SKILL.md`의 강제 가능한 비밀번호 및 TOTP 등록 계약

- [ ] **Step 1: 배포본 요구사항 테스트를 먼저 추가한다**

기존 `installs the complete skill for Codex` 테스트에서 설치된 스킬을 한 번 읽고 다음 핵심 문구를 확인한다.

```js
const installedSkill = await readFile(join(target, 'SKILL.md'), 'utf8');

assert.match(installedSkill, /name: building-secure-admin-pages/);
for (const requirement of [
  /at least 10 characters/,
  /uppercase letter, one lowercase letter, one digit, and one ASCII special character/,
  /three or more consecutive characters/,
  /iOS App Store installation QR/,
  /Android Google Play installation QR/,
  /account-specific `otpauth:\/\/totp\/` QR/,
  /Never send the TOTP secret.*external QR-generation service/,
  /valid six-digit TOTP code/,
]) {
  assert.match(installedSkill, requirement);
}
```

- [ ] **Step 2: 테스트가 정책 누락으로 실패하는지 확인한다**

Run: `node --test test/install.test.mjs`

Expected: `at least 10 characters` 패턴을 찾지 못해 FAIL한다.

- [ ] **Step 3: 최소 스킬 계약을 추가한다**

`Accounts and authentication`에 다음 내용을 명령형 규칙으로 추가한다.

```markdown
- Enforce one password policy server-side before hashing or storage on invitation completion, password changes, and resets:
  - Require at least 10 characters with at least one uppercase letter, one lowercase letter, one digit, and one ASCII special character other than whitespace.
  - Normalize the password, login ID, and name with Unicode NFKC, case-folding, and whitespace removal. Reject a password containing the full normalized ID or name, any contiguous three-character substring of either, or the full value when either is one or two characters long.
  - Reject the same character repeated three or more times consecutively and ascending or descending digit sequences of three or more digits.
  - On failure, identify the unmet rules without echoing or recording the password and leave the account, invitation, and stored hash unchanged.
- During invitation setup, show the invitee three labeled QR codes: the official iOS App Store installation QR, the official Android Google Play installation QR, and one account-specific `otpauth://totp/` QR shared by both platforms. Include direct, clickable official store links without shorteners, redirects, or tracking parameters; do not add device detection.
- Generate the TOTP QR locally or on the application server. Never send the TOTP secret or provisioning URI to an external QR-generation service, cache, log, analytics event, or client-side storage; return it with `Cache-Control: no-store`, encrypt the secret at rest, and never expose it to the inviting administrator.
- Put matching URL-encoded issuer values in the TOTP label and `issuer` parameter and encode the secret with Base32. Reuse project TOTP settings or default to SHA-1, six digits, and a 30-second period for Google Authenticator compatibility.
- Activate the account only after the invitee submits a valid six-digit TOTP code. Apply the existing repeated-failure restriction, destroy unfinished secrets when invitations expire, and never redisplay the provisioning QR after setup succeeds.
```

- [ ] **Step 4: 수정된 정책으로 테스트를 통과시킨다**

Run: `node --test test/install.test.mjs`

Expected: 6 tests pass, 0 fail.

- [ ] **Step 5: 스킬과 패키지를 전체 검증한다**

Run: `python C:/Users/Owner/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/building-secure-admin-pages`

Expected: skill validation succeeds.

Run: `npm test`

Expected: 6 tests pass, 0 fail.

Run: `npm pack --dry-run`

Expected: exit code 0 and `skills/building-secure-admin-pages/SKILL.md` appears in the package file list.

- [ ] **Step 6: 변경을 커밋하고 현재 브랜치를 푸시한다**

```powershell
git add -- skills/building-secure-admin-pages/SKILL.md test/install.test.mjs
git commit -m "feat: enforce sub-admin credential setup"
git push
```
