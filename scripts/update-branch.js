const {updateExerciseBranch, spawnSync} = require('./utils')

process.env.HUSKY_SKIP_HOOKS = 1

updateExerciseBranch(spawnSync('git rev-parse --abbrev-ref HEAD'))
