const cp = require('child_process')
const {username} = require('os').userInfo()

const execSync = (...args) =>
  cp
    .execSync(...args)
    .toString()
    .trim()

const branch = execSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master' && username === 'kentcdodds') {
  updateExercises()
} else {
  console.log(
    `The branch ${branch} is not "master" or the username ${username} is not kentcdodds. So skipping post-commit hook.`,
  )
}

function updateExercises() {
  console.log('Updating exercise branches')
  const masterCommit = execSync('git rev-parse master')
  const branches = execSync(
    `git for-each-ref --format='%(refname:short)'`,
  ).split('\n')
  const exerciseBranches = branches.filter(b => b.startsWith('exercises/'))
  exerciseBranches.forEach(branch => {
    const didUpdate = updateExerciseBranch(branch, masterCommit)
    console.log(`${branch} is up to date.`)
    if (didUpdate) {
      console.log(`Force pushing ${branch}`)
      execSync('git push -f')
    }
  })
  execSync('git checkout master')
  console.log('All exercises up to date.')
}

function updateExerciseBranch(branch, masterCommit) {
  execSync(`git checkout ${branch}`)
  const exerciseCommit = execSync(`git rev-parse ${branch}`)
  const parentCommit = execSync(`git rev-parse ${branch}^`)
  if (masterCommit === parentCommit) {
    return false
  }
  console.log(
    `> The ${branch} exercise commit SHA: ${exerciseCommit} (save this in case something goes wrong).`,
  )
  execSync(`git reset --hard master`)
  const result = execSync(`git cherry-pick ${exerciseCommit}`)
  if (result.includes('error: could not apply')) {
    console.error(
      'Merge conflict. Fix the conflict, then run the update-exercises script again to be sure you have everything up to date.',
    )
    throw result
  }
  return true
}
