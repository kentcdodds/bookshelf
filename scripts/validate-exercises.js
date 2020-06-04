const {spawnSync, getVariants} = require('./utils')

const masterFiles = Object.keys(getVariants())

if (masterFiles.length) {
  spawnSync('node ./scripts/swap final')
  spawnSync('node ./scripts/update-links')
  spawnSync(`git add INSTRUCTIONS.md "${masterFiles.join('" "')}"`)
}
