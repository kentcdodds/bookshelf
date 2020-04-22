const {spawnSync} = require('./utils')
const cp = require('child_process')

const branches = spawnSync('git branch -r')
  .split('\n')
  .map(b => b.trim())
  .filter(Boolean)
  .filter(b => b.startsWith('origin/exercises/'))

for (const branch of branches) {
  const localBranch = branch.replace('origin/', '')
  const command = `git branch --track "${localBranch}" "${branch}"`
  // we're going to ignore errors
  // so we'll use child_process directly
  cp.spawnSync(command, {shell: true, stdio: 'pipe'})
}

// we'll ignore errors here as well
cp.spawnSync('git pull --all', {shell: true, stdio: 'pipe'})
