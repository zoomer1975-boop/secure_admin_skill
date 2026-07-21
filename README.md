# Secure Admin Skill

웹사이트 관리자 페이지를 설계·구현·검토할 때 필요한 보안, 권한, 감사로그, 개인정보 보호 규칙을 제공하는 Agent Skill입니다.

- 스킬 이름: `building-secure-admin-pages`
- 지원 도구: Codex, Claude Code
- 설치 방식: GitHub에서 `npx`로 직접 설치

## 주요 규칙

- 홈페이지에 관리자 링크를 노출하지 않고 유추하기 어려운 경로 사용
- 최고관리자·부관리자 구분 및 1인 1계정 적용
- 전체 관리자 TOTP와 계정별 IP 허용 목록 적용
- 메뉴·하위 메뉴마다 조회, 추가, 수정, 삭제, 내보내기 권한 분리
- 모든 요청에서 서버 측 권한검사 수행
- 관리자 행위를 변경할 수 없는 감사로그로 기록하고 기록 실패 시 요청 거부
- 개인정보 최소 수집, 보유기간 설정 및 복구 불가능한 파기 확인

전체 규칙은 [SKILL.md](skills/building-secure-admin-pages/SKILL.md)에서 확인할 수 있습니다.

## 요구 사항

- Node.js 18 이상
- Codex 또는 Claude Code

## 설치

### Codex

```bash
npx --yes github:zoomer1975-boop/secure_admin_skill -- --codex
```

설치 위치: `~/.agents/skills/building-secure-admin-pages`

### Claude Code

```bash
npx --yes github:zoomer1975-boop/secure_admin_skill -- --claude
```

설치 위치:

- `CLAUDE_CONFIG_DIR` 설정 시: `$CLAUDE_CONFIG_DIR/skills/building-secure-admin-pages`
- 미설정 시: `~/.claude/skills/building-secure-admin-pages`

### Codex와 Claude Code에 모두 설치

```bash
npx --yes github:zoomer1975-boop/secure_admin_skill -- --all
```

설치 후 스킬이 목록에 보이지 않으면 해당 도구를 새 세션에서 다시 시작하세요.

## 기존 설치 덮어쓰기

기존 대상 폴더가 있으면 설치기는 파일을 변경하지 않고 종료합니다. 검토 후 교체하려면 `--force`를 추가합니다.

```bash
npx --yes github:zoomer1975-boop/secure_admin_skill -- --all --force
```

`--force`는 선택한 도구의 `building-secure-admin-pages` 스킬 폴더를 삭제하고 배포본으로 교체합니다.

## 사용

Codex에서는 `$building-secure-admin-pages`를 명시하거나 관리자 페이지 관련 작업을 요청합니다.

```text
$building-secure-admin-pages를 사용해 이 프로젝트의 관리자 페이지를 검토해줘.
```

Claude Code에서는 다음처럼 직접 호출할 수 있습니다.

```text
/building-secure-admin-pages 이 프로젝트의 관리자 권한과 감사로그를 검토해줘.
```

## 개발 및 검증

```bash
npm test
npm pack --dry-run
```

테스트는 임시 사용자 폴더에서 실행되며 실제 Codex 또는 Claude Code 설정을 변경하지 않습니다. 설치기는 Node.js 기본 모듈만 사용합니다.

## 법률 관련 안내

이 스킬은 개발 규칙을 제공하며 개별 서비스에 대한 법률 자문을 대신하지 않습니다. 개인정보 보호 적합성이 중요한 경우 [개인정보보호위원회](https://www.pipc.go.kr/)와 [국가법령정보센터](https://www.law.go.kr/)에서 현재 적용되는 법령과 고시를 다시 확인하세요.
