import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RUST_PACKAGE_NAME = 'piano';

const rootDir = resolve(import.meta.dirname, '..');
const packageJsonPath = resolve(rootDir, 'package.json');
const packageLockPath = resolve(rootDir, 'package-lock.json');
const cargoTomlPath = resolve(rootDir, 'src-tauri', 'Cargo.toml');
const cargoLockPath = resolve(rootDir, 'src-tauri', 'Cargo.lock');

const args = process.argv.slice(2);
const rawVersion = args.find((arg) => !arg.startsWith('-'));
const shouldCommit = args.includes('--commit');
const shouldTag = args.includes('--tag');
const debug = args.includes('--debug');

if (!rawVersion) {
  printUsageAndExit();
}

if (shouldTag && !shouldCommit) {
  throw new Error(
    'Use --tag together with --commit so the tag points to the version commit.',
  );
}

const version = normalizeVersion(rawVersion);
const tagName = `v${version}`;

updateJsonFile('package.json', packageJsonPath, (packageJson) => {
  const previousVersion = packageJson.version;

  packageJson.version = version;

  return {
    json: packageJson,
    changes: [formatVersionChange('version', previousVersion, version)],
  };
});

updateJsonFile('package-lock.json', packageLockPath, (packageLock) => {
  const changes = [
    formatVersionChange('version', packageLock.version, version),
  ];

  packageLock.version = version;

  if (packageLock.packages?.['']) {
    changes.push(
      formatVersionChange(
        'packages[""].version',
        packageLock.packages[''].version,
        version,
      ),
    );
    packageLock.packages[''].version = version;
  }

  return { json: packageLock, changes };
});

updateCargoToml(cargoTomlPath, version);
updateCargoLock(cargoLockPath, version);

if (debug) {
  process.exit(0);
}

console.log(`Set project version to ${version}`);

if (shouldCommit || shouldTag) {
  runGit('add', [
    'package.json',
    'package-lock.json',
    'src-tauri/Cargo.toml',
    'src-tauri/Cargo.lock',
  ]);
}

if (shouldCommit) {
  runGit('commit', ['-m', `chore: release ${tagName}`]);
}

if (shouldTag) {
  runGit('tag', [tagName]);
}

function normalizeVersion(value) {
  const normalized = value.replace(/^v/, '');
  const semverPattern =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

  if (!semverPattern.test(normalized)) {
    throw new Error(`Invalid semver version: ${value}`);
  }

  return normalized;
}

function updateJsonFile(label, filePath, update) {
  const json = JSON.parse(readFileSync(filePath, 'utf8'));
  const { json: updatedJson, changes } = update(json);
  const output = `${JSON.stringify(updatedJson, null, 2)}\n`;

  logDebugChanges(label, changes);

  if (!debug) {
    writeFileSync(filePath, output);
  }
}

function updateCargoToml(filePath, nextVersion) {
  const input = readFileSync(filePath, 'utf8');
  const regex = /(^\[package\]\r?\n(?:[^\[]*\r?\n)*?^version\s*=\s*)"([^"]+)"/m;

  const match = input.match(regex);

  if (!match) {
    throw new Error(
      `Could not find package "${RUST_PACKAGE_NAME}" in src-tauri/Cargo.toml`,
    );
  }

  const [, , previousVersion] = match;
  const output = input.replace(regex, `$1"${nextVersion}"`);

  logDebugChanges('src-tauri/Cargo.toml', [
    formatVersionChange(
      `${RUST_PACKAGE_NAME}.version`,
      previousVersion,
      nextVersion,
    ),
  ]);

  if (!debug) {
    writeFileSync(filePath, output);
  }
}

function updateCargoLock(filePath, nextVersion) {
  const input = readFileSync(filePath, 'utf8');
  const regex = new RegExp(
    `(^\\[\\[package\\]\\]\\r?\\nname = "${escapeRegExp(RUST_PACKAGE_NAME)}"\\r?\\nversion = )"([^"]+)"`,
    'm',
  );

  const match = input.match(regex);

  if (!match) {
    throw new Error(
      `Could not find package "${RUST_PACKAGE_NAME}" in src-tauri/Cargo.lock`,
    );
  }

  const [, , previousVersion] = match;
  const output = input.replace(regex, `$1"${nextVersion}"`);

  logDebugChanges('src-tauri/Cargo.lock', [
    formatVersionChange(
      `${RUST_PACKAGE_NAME}.version`,
      previousVersion,
      nextVersion,
    ),
  ]);

  if (!debug) {
    writeFileSync(filePath, output);
  }
}

function formatVersionChange(field, previousVersion, nextVersion) {
  return `${field}: ${previousVersion} -> ${nextVersion}`;
}

function logDebugChanges(label, changes) {
  if (!debug) {
    return;
  }

  console.log(`[DEBUG] ${label}`);

  for (const change of changes) {
    console.log(`[DEBUG] ${change}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function runGit(command, commandArgs) {
  execFileSync('git', [command, ...commandArgs], {
    cwd: rootDir,
    stdio: 'inherit',
  });
}

function printUsageAndExit() {
  console.error(
    'Usage: npm run set:version -- <version> [--commit] [--tag] [--debug]',
  );
  process.exit(1);
}
