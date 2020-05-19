const {username} = require('os').userInfo()
const {
  spawnSync,
  getExerciseBranches,
  updateExerciseBranch,
} = require('./utils')

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
  const exerciseBranches = getExerciseBranches()
  exerciseBranches.forEach(branch => {
    const didUpdate = updateExerciseBranch(branch)
    console.log(`  ✅  ${branch} is up to date.`)
    if (didUpdate) {
      console.log(`Force pushing ${branch}`)
      spawnSync('git push -f')
    }
  })
  spawnSync('git checkout master')
  console.log('✅  All exercises up to date.')
}
