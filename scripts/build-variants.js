const fs = require('fs')
const pkg = require('../package.json')
const {spawnSync, getExtraCreditTitles} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master') {
  console.log('Cannot run swap on master as there are no exercises.')
} else {
  go()
}

function go() {
  const variants = [
    'exercise',
    ...getExtraCreditTitles().map((x, i) => i + 1),
    'final',
  ]

  const originalHomepage = pkg.homepage

  function updateHomepage(pathname = '') {
    const newHomepage = originalHomepage + pathname
    fs.writeFileSync(
      'package.json',
      JSON.stringify({...pkg, homepage: newHomepage}, null, 2) + '\n',
    )
  }

  spawnSync('mkdir -p node_modules/.cache/build')

  const getRedirect = path =>
    `
${path}/        ${path}/list              302!
${path}/*       ${path}/index.html        200
  `.trim()

  let redirects = []
  for (const variant of variants) {
    const dirname = typeof variant === 'number' ? `extra-${variant}` : variant
    console.log(`▶️  Starting build for "${dirname}"`)
    try {
      updateHomepage(`${dirname}/`)
      spawnSync(`node ./scripts/swap ${variant}`, {stdio: 'inherit'})
      spawnSync(`react-scripts build`, {stdio: 'inherit'})
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
      redirects.push(getRedirect(`/${dirname}`))
    } catch (error) {
      console.log(`🚨  error building for "${dirname}"`)
      throw error
    }
  }

  updateHomepage()

  console.log(
    '✅  all variants have been built, moving them to build and creating redirects file',
  )

  spawnSync('mv node_modules/.cache/build/* build/')
  const redirectContents = `${redirects.join('\n\n')}\n\n${getRedirect('')}`
  fs.writeFileSync('build/_redirects', redirectContents)
  console.log('✅  all done. Ready to deploy')
}
