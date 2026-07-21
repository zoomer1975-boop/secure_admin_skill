#!/usr/bin/env node

import { access, cp, mkdir, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillName = 'building-secure-admin-pages';
const source = fileURLToPath(new URL(`../skills/${skillName}`, import.meta.url));
const targetFlags = ['--codex', '--claude', '--all'];
const allowedFlags = new Set([...targetFlags, '--force', '--help']);

function usage() {
  console.log(`Usage: building-secure-admin-pages (--codex | --claude | --all) [--force]

  --codex   Install for Codex
  --claude  Install for Claude Code
  --all     Install for both
  --force   Replace an existing installation
  --help    Show this help`);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function resolveTargets(flag) {
  const home = homedir();
  const codex = join(home, '.agents', 'skills', skillName);
  const claudeRoot = process.env.CLAUDE_CONFIG_DIR || join(home, '.claude');
  const claude = join(claudeRoot, 'skills', skillName);

  if (flag === '--codex') return [codex];
  if (flag === '--claude') return [claude];
  return [codex, claude];
}

async function main(args) {
  const unknown = args.filter((arg) => !allowedFlags.has(arg));
  if (unknown.length) throw new Error(`Unknown option: ${unknown[0]}`);

  if (args.includes('--help')) {
    usage();
    return;
  }

  const selected = targetFlags.filter((flag) => args.includes(flag));
  if (selected.length !== 1) {
    throw new Error('Choose exactly one of --codex, --claude, or --all.');
  }

  await access(join(source, 'SKILL.md'));

  const targets = resolveTargets(selected[0]);
  const force = args.includes('--force');
  const existing = [];

  for (const target of targets) {
    if (await exists(target)) existing.push(target);
  }

  if (existing.length && !force) {
    throw new Error(`Installation already exists: ${existing.join(', ')}. Re-run with --force to replace it.`);
  }

  for (const target of targets) {
    if (force) await rm(target, { recursive: true, force: true });
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { recursive: true, errorOnExist: true, force: false });
    console.log(`Installed ${skillName} to ${target}`);
  }
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
