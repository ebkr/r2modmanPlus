#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {
    input: null,
    output: null,
    repo: null,
    commit: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--output') args.output = argv[++i];
    else if (arg === '--repo') args.repo = argv[++i];
    else if (arg === '--commit') args.commit = argv[++i];
    else fail(`Unknown argument: ${arg}`);
  }

  if (!args.input || !args.output || !args.repo || !args.commit) {
    fail(`
      Usage:
        node script.mjs \
          --input <path> \
          --output <path> \
          --repo <git-url> \
          --commit <sha>
    `);
  }

  return args;
}

const { input, output, repo, commit } = parseArgs(process.argv);

const raw = fs.readFileSync(input, 'utf8');
const manifest = YAML.parse(raw);

if (!manifest || typeof manifest !== 'object') {
  fail('Invalid YAML manifest');
}

if (!Array.isArray(manifest.modules)) {
  fail('Manifest missing "modules"');
}

const module = manifest.modules.find(
  (m) => m && m.name === 'r2modmanPlus'
);

if (!module) {
  fail('Could not find module "r2modmanPlus"');
}

if (!Array.isArray(module.sources) || module.sources.length === 0) {
  fail('Module has no sources');
}

// Replace ONLY the first source entry
module.sources[0] = {
  type: 'git',
  url: repo,
  commit: commit,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, YAML.stringify(manifest), 'utf8');

console.log('Generated manifest:');
console.log(`  Input:  ${input}`);
console.log(`  Output: ${output}`);
console.log(`  Repo:   ${repo}`);
console.log(`  Commit: ${commit}`);