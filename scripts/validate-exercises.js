const {spawnSync, getVariants} = require('./utils')

const masterFiles = Object.keys(getVariants())

if (masterFiles.length) {
  spawnSync('node ./scripts/swap final')
  spawnSync(`git add "${masterFiles.join('" "')}"`)
}
