# Cross-Agent npx Skill Installer Design

## Goal

Package `building-secure-admin-pages` as a dependency-free npm CLI that installs the same skill for Codex, Claude Code, or both.

## Chosen approach

Use one canonical skill directory inside this repository and one Node.js installer that copies it to the selected user-level locations.

Alternatives not selected:

- Separate Codex and Claude Code plugins: native but duplicates packaging and release work.
- A shared directory with symbolic links: smaller on one machine but unreliable across Windows, macOS, permissions, and package-manager environments.

The direct-copy CLI is the smallest portable option. Native Codex or Claude plugin packaging can be added later only if marketplace distribution is requested.

## Package layout

```text
README.md
package.json
bin/
  install.mjs
skills/
  building-secure-admin-pages/
    SKILL.md
    agents/
      openai.yaml
test/
  install.test.mjs
```

The repository copy under `skills/` is the canonical distributable artifact. Both tools receive the same directory. Claude Code ignores the optional Codex UI metadata under `agents/`; Codex uses it.

`README.md` is written in Korean for GitHub users and contains the project purpose, principal administrator-page safeguards, prerequisites, Codex/Claude/both installation commands, overwrite behavior, installed paths, invocation examples, and the legal-advice limitation.

## Command interface

```text
npx building-secure-admin-pages --codex
npx building-secure-admin-pages --claude
npx building-secure-admin-pages --all
npx building-secure-admin-pages --all --force
```

Until the package is published to npm, GitHub users install it directly:

```text
npx --yes github:zoomer1975-boop/secure_admin_skill --codex
npx --yes github:zoomer1975-boop/secure_admin_skill --claude
npx --yes github:zoomer1975-boop/secure_admin_skill --all
```

Exactly one target flag is required. `--help` prints usage. Unknown flags, missing target flags, or multiple target flags exit nonzero without writing files.

## Install locations

- Codex: `$HOME/.agents/skills/building-secure-admin-pages`
- Claude Code: `$CLAUDE_CONFIG_DIR/skills/building-secure-admin-pages` when `CLAUDE_CONFIG_DIR` is set; otherwise `$HOME/.claude/skills/building-secure-admin-pages`

The installer does not migrate or delete older installations such as `$CODEX_HOME/skills`. Current official user locations are the default.

## Copy and overwrite behavior

1. Resolve the packaged skill directory relative to `bin/install.mjs`.
2. Resolve all selected target directories before writing.
3. Verify the packaged `SKILL.md` exists.
4. Preflight every target. If any exists and `--force` is absent, exit nonzero before copying anything.
5. With `--force`, remove only the exact selected skill target and then copy the canonical directory.
6. Print each installed target and exit zero.

No third-party runtime dependency is allowed. Use Node.js `fs`, `os`, `path`, and `url` modules only.

## Tests

Use Node's built-in `node:test` runner with temporary home directories. Tests must cover:

- Codex-only installation.
- Claude-only installation, including `CLAUDE_CONFIG_DIR`.
- Dual installation with `--all`.
- Refusal to overwrite an existing target without `--force` and no partial writes.
- Replacement of an existing target with `--force`.
- Rejection of invalid target arguments.
- Package contents through `npm pack --dry-run`.

Every test runs against temporary directories; tests must never write to the real user home.

## Publication boundary

This implementation produces a publish-ready package, verifies its tarball contents, and pushes the repository to `https://github.com/zoomer1975-boop/secure_admin_skill`. Publishing to npm, choosing an npm owner, and creating registry credentials remain separate actions requiring explicit approval.

## Success criteria

- `npm test` passes.
- `npm pack --dry-run` includes only the CLI and distributable skill files required at runtime.
- The existing Codex skill validator accepts the packaged skill.
- The working tree contains no generated tarball or installed test artifacts.
- The GitHub remote branch resolves to the same commit as the local branch after push.
