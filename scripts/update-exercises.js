const {username} = require('os').userInfo()
const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master' && username === 'kentcdodds') {
  updateExercises()
} else {
  console.log(
    `The branch ${branch} is not "master" or the username ${username} is not kentcdodds. So skipping post-commit hook.`,
  )
}

function updateExercises() {
  console.log('▶️  Updating exercise branches')
  const masterCommit = spawnSync('git rev-parse master')
  const branches = spawnSync(
    `git for-each-ref --format='%(refname:short)'`,
  ).split('\n')
  const exerciseBranches = branches.filter(b => b.startsWith('exercises/'))
  exerciseBranches.forEach(branch => {
    const didUpdate = updateExerciseBranch(branch, masterCommit)
    console.log(`  ✅  ${branch} is up to date.`)
    if (didUpdate) {
      console.log(`Force pushing ${branch}`)
      spawnSync('git push -f')
    }
  })
  spawnSync('git checkout master')
  console.log('✅  All exercises up to date.')
}

function updateExerciseBranch(branch, masterCommit) {
  spawnSync(`git checkout ${branch}`)
  const exerciseCommit = spawnSync(`git rev-parse ${branch}`)
  const parentCommit = spawnSync(`git rev-parse ${branch}^`)
  if (masterCommit === parentCommit) {
    return false
  }
  console.log(
    `> The ${branch} exercise commit SHA: ${exerciseCommit} (save this in case something goes wrong).`,
  )
  spawnSync(`git reset --hard master`)
  try {
    const result = spawnSync(
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
  spawnSync(`git status | sed -n 's/deleted by them://p' | xargs git rm`)
  const status = spawnSync('git status')
  if (
    status.includes('Changes not staged for commit') ||
    status.includes('Unmerged')
  ) {
    console.error(
      '❌  Merge conflict. Fix the conflict, then run the update-exercises script again to be sure you have everything up to date.',
    )
    throw status
  }
  spawnSync(`git cherry-pick --quit`)
  spawnSync(`git commit -am "${branch}"`)
  return true
}
