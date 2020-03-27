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
  console.log('▶️  Updating exercise branches')
  const masterCommit = execSync('git rev-parse master')
  const branches = execSync(
    `git for-each-ref --format='%(refname:short)'`,
  ).split('\n')
  const exerciseBranches = branches.filter(b => b.startsWith('exercises/'))
  exerciseBranches.forEach(branch => {
    const didUpdate = updateExerciseBranch(branch, masterCommit)
    console.log(`  ✔️  ${branch} is up to date.`)
    if (didUpdate) {
      console.log(`Force pushing ${branch}`)
      execSync('git push -f')
    }
  })
  execSync('git checkout master')
  console.log('✅  All exercises up to date.')
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
  try {
    const result = execSync(
      `git cherry-pick ${exerciseCommit} --strategy-option theirs`,
    )
    if (!result.includes('error: could not apply')) {
      return true
    }
  } catch (error) {
    // let's try to fix things maybe... This might be a terrible idea though..
  }
  // the conflict is probably because files were deleted in the branch and we
  // should delete them again. For some reason --strategy-option theres doesn't
  // do this by default. 🤔
  execSync(`git status | sed -n 's/deleted by them://p' | xargs git rm`)
  const status = execSync('git status')
  if (
    status.includes('Changes not staged for commit') ||
    status.includes('Unmerged')
  ) {
    console.error(
      '❌  Merge conflict. Fix the conflict, then run the update-exercises script again to be sure you have everything up to date.',
    )
    throw status
  }
  execSync(`git cherry-pick --quit`)
  const commitMsg = `git log --format=%B -n 1 ${exerciseCommit}`
  execSync(`git commit -am "${commitMsg}"`)
  return true
}
