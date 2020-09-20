const {spawnSync, getVariants} = require('./utils')

const mainFiles = Object.keys(getVariants())

if (mainFiles.length) {
  spawnSync('node ./scripts/swap final')
  spawnSync('node ./scripts/update-links')
  spawnSync(`git add INSTRUCTIONS.md "${mainFiles.join('" "')}"`)
}
