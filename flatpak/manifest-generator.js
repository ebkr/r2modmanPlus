#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const ROOT = process.cwd();
const DEFAULT_INPUT = path.join(
  ROOT,
  'flatpak',
  'io.github.ebkr.r2modman.template.yaml'
);
const PACKAGE_JSON = path.join(ROOT, 'package.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getDefaultOutputPath(inputPath) {
  const parsed = path.parse(inputPath);

  if (!parsed.base.includes('.template.')) {
    fail(
      `Input file must contain ".template." in its name so an output path can be derived: ${inputPath}`
    );
  }

  return path.join(
    parsed.dir,
    parsed.base.replace('.template.', '.')
  );
}

function parseArgs(argv) {
  const args = {
    mode: null,
    input: DEFAULT_INPUT,
    output: null,
    gitUrl: 'https://github.com/ebkr/r2modmanPlus.git',
    localPath: '..',
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!args.mode && ['local', 'release'].includes(arg)) {
      args.mode = arg;
      continue;
    }

    if (arg === '--input') {
      args.input = argv[++i];
      continue;
    }

    if (arg === '--output') {
      args.output = argv[++i];
      continue;
    }

    if (arg === '--git-url') {
      args.gitUrl = argv[++i];
      continue;
    }

    if (arg === '--local-path') {
      args.localPath = argv[++i];
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  if (!args.mode) {
    fail(
      'Usage: node flatpak/generate-flatpak-manifest.mjs <local|release> [--input path] [--output path] [--git-url url] [--local-path path]'
    );
  }

  if (!args.output) {
    args.output = getDefaultOutputPath(args.input);
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeYaml(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, YAML.stringify(data), 'utf8');
}

function getVersionTag() {
  const pkg = readJson(PACKAGE_JSON);

  if (!pkg?.version || typeof pkg.version !== 'string') {
    fail('Could not read version from package.json');
  }

  return `v${pkg.version}`;
}

function buildReplacementSource(mode, options) {
  if (mode === 'local') {
    return {
      type: 'dir',
      path: options.localPath,
    };
  }

  return {
    type: 'git',
    url: options.gitUrl,
    tag: getVersionTag(),
  };
}

const options = parseArgs(process.argv);
const manifest = readYaml(options.input);

if (!manifest || typeof manifest !== 'object') {
  fail('Manifest did not parse into an object');
}

if (!Array.isArray(manifest.modules) || manifest.modules.length === 0) {
  fail('Manifest is missing modules');
}

const module = manifest.modules.find((entry) => entry?.name === 'r2modmanPlus');

if (!module) {
  fail('Could not find module named "r2modmanPlus"');
}

if (!Array.isArray(module.sources) || module.sources.length === 0) {
  fail('Module "r2modmanPlus" has no sources array');
}

const replacementSource = buildReplacementSource(options.mode, options);

if (!module.sources[0] || typeof module.sources[0] !== 'object') {
  fail('Expected the first source entry to be an object');
}

const outputManifest = structuredClone(manifest);
const outputModule = outputManifest.modules.find(
  (entry) => entry?.name === 'r2modmanPlus'
);

outputModule.sources[0] = replacementSource;

writeYaml(options.output, outputManifest);

console.log(`Template: ${options.input}`);
console.log(`Output:   ${options.output}`);
console.log(`Mode:     ${options.mode}`);

if (options.mode === 'local') {
  console.log(`Source:   dir -> ${options.localPath}`);
} else {
  console.log(`Source:   git -> ${options.gitUrl} @ ${replacementSource.tag}`);
}