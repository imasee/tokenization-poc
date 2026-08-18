#!/usr/bin/env node
// Commits + pushes current changes to master on every configured remote, then builds
// production and publishes dist/ to the imasee/tokenization-poc gh-pages branch.
const { execSync } = require('node:child_process');

const PAGES_REPO_URL = 'https://github.com/imasee/tokenization-poc.git';
const BASE_HREF = '/tokenization-poc/';
const DIST_DIR = 'dist/tokenization-poc/browser';

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const commitMessage = process.argv.slice(2).join(' ') || 'chore: update';

try {
  run('git add -A');
  run(`git commit -m "${commitMessage}"`);
} catch {
  console.log('Nothing to commit, skipping.');
}

const remotes = execSync('git remote')
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

for (const remote of remotes) {
  run(`git push ${remote} master`);
}

run(`npx ng build --configuration production --base-href ${BASE_HREF}`);
run(`npx gh-pages -d ${DIST_DIR} -r ${PAGES_REPO_URL} -b gh-pages -m "deploy: publish build to GitHub Pages"`);

console.log('\nDeployed to https://imasee.github.io/tokenization-poc/');
