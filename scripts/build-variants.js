const fs = require('fs')
const glob = require('glob')
const pkg = require('../package.json')
const {spawnSync} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master') {
  console.log('Cannot run swap on master as there are no exercises.')
} else {
  go()
}

function go() {
  function getExtraCreditNumberFromFilename(line) {
    const m = line.match(/\.extra-(?<number>\d+).js$/)
    if (!m) {
      return null
    }
    return Number(m.groups.number)
  }

  const ecNumbersAll = glob
    .sync('./src/**/*.extra-*')
    .map(ecFile => getExtraCreditNumberFromFilename(ecFile))
  const ecNumbers = new Set(ecNumbersAll)

  const variants = ['exercise', ...ecNumbers, 'final']

  const originalHomepage = pkg.homepage

  function updateHomepage(pathname = '') {
    const newHomepage = originalHomepage + pathname
    fs.writeFileSync(
      'package.json',
      JSON.stringify({...pkg, homepage: newHomepage}, null, 2) + '\n',
    )
  }

  spawnSync('mkdir -p node_modules/.cache/build')

  for (const variant of variants) {
    const dirname = typeof variant === 'number' ? `extra-${variant}` : variant
    console.log(`▶️  Starting build for "${dirname}"`)
    try {
      updateHomepage(dirname)
      spawnSync(`node ./scripts/swap ${variant} && npm run build`, {
        stdio: 'inherit',
      })
      if (variant === 'final') {
        spawnSync(`cp -r build node_modules/.cache/build/${dirname}`, {
          stdio: 'inherit',
        })
      } else {
        spawnSync(`mv build node_modules/.cache/build/${dirname}`, {
          stdio: 'inherit',
        })
      }
      console.log(`✅  finished build for "${dirname}"`)
    } catch (error) {
      console.log(`🚨  error building for "${dirname}"`)
      throw error
    }
  }

  updateHomepage()

  console.log('✅  all variants have been built, moving them to build')
  spawnSync('mv node_modules/.cache/build/* build/')
  console.log('✅  all done. Ready to deploy')
}
