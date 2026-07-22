import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const cli = join(repoRoot, 'bin', 'install.mjs');
const skillName = 'building-secure-admin-pages';

async function temporaryHome(t) {
  const home = await mkdtemp(join(tmpdir(), 'secure-admin-skill-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  return home;
}

function runInstaller(home, args, extraEnv = {}) {
  const env = { ...process.env, HOME: home, USERPROFILE: home };
  delete env.CLAUDE_CONFIG_DIR;
  Object.assign(env, extraEnv);

  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    env,
  });
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

test('installs the complete skill for Codex', async (t) => {
  const home = await temporaryHome(t);
  const result = runInstaller(home, ['--codex']);
  const target = join(home, '.agents', 'skills', skillName);

  assert.equal(result.status, 0, result.stderr);
  const installedSkill = await readFile(join(target, 'SKILL.md'), 'utf8');
  assert.match(installedSkill, /name: building-secure-admin-pages/);
  for (const requirement of [
    /at least 10 characters/,
    /uppercase letter, one lowercase letter, one digit, and one ASCII special character/,
    /three or more consecutive characters/,
    /Enforce one password policy server-side before hashing or storage on invitation completion, password changes, and resets:/,
    /Normalize the password, login ID, and name with Unicode NFKC.*full normalized ID or name, any contiguous three-character substring/,
    /ascending or descending digit sequences of three or more digits/,
    /leave the account, invitation, and stored hash unchanged/,
    /iOS App Store installation QR/,
    /Android Google Play installation QR/,
    /direct, clickable official store links without shorteners, redirects, or tracking parameters/,
    /iOS App Store.*Android Google Play.*direct, clickable official store links/,
    /account-specific `otpauth:\/\/totp\/` QR/,
    /Never send the TOTP secret.*external QR-generation service/,
    /Cache-Control: no-store/,
    /encrypt the secret at rest/,
    /never expose it to the inviting administrator/,
    /destroy unfinished secrets when invitations expire/,
    /never redisplay the provisioning QR after setup succeeds/,
    /valid six-digit TOTP code/,
  ]) {
    assert.match(installedSkill, requirement);
  }
  assert.match(await readFile(join(target, 'agents', 'openai.yaml'), 'utf8'), /display_name:/);
});

test('installs for Claude Code under CLAUDE_CONFIG_DIR', async (t) => {
  const home = await temporaryHome(t);
  const claudeConfig = join(home, 'custom-claude');
  const result = runInstaller(home, ['--claude'], { CLAUDE_CONFIG_DIR: claudeConfig });
  const target = join(claudeConfig, 'skills', skillName, 'SKILL.md');

  assert.equal(result.status, 0, result.stderr);
  assert.equal(await exists(target), true);
});

test('preflights all targets before writing', async (t) => {
  const home = await temporaryHome(t);
  const claudeTarget = join(home, '.claude', 'skills', skillName);
  const sentinel = join(claudeTarget, 'keep.txt');
  await mkdir(dirname(sentinel), { recursive: true });
  await writeFile(sentinel, 'keep', 'utf8');

  const result = runInstaller(home, ['--all']);
  const codexTarget = join(home, '.agents', 'skills', skillName);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /already exists/);
  assert.equal(await exists(codexTarget), false);
  assert.equal(await readFile(sentinel, 'utf8'), 'keep');
});

test('--force replaces existing targets and installs both', async (t) => {
  const home = await temporaryHome(t);
  const targets = [
    join(home, '.agents', 'skills', skillName),
    join(home, '.claude', 'skills', skillName),
  ];

  for (const target of targets) {
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'stale.txt'), 'stale', 'utf8');
  }

  const result = runInstaller(home, ['--all', '--force']);

  assert.equal(result.status, 0, result.stderr);
  for (const target of targets) {
    assert.equal(await exists(join(target, 'SKILL.md')), true);
    assert.equal(await exists(join(target, 'stale.txt')), false);
  }
});

test('rejects multiple target flags', async (t) => {
  const home = await temporaryHome(t);
  const result = runInstaller(home, ['--codex', '--claude']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Choose exactly one of --codex, --claude, or --all/);
});

test('documents executable GitHub npx commands', async () => {
  const readme = await readFile(join(repoRoot, 'README.md'), 'utf8');

  assert.doesNotMatch(readme, /github:zoomer1975-boop\/secure_admin_skill -- --/);
  for (const flag of ['--codex', '--claude', '--all']) {
    assert.match(readme, new RegExp(`npx --yes github:zoomer1975-boop/secure_admin_skill ${flag}`));
  }
});
