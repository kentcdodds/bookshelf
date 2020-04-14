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
    const url = new URL(originalHomepage)
    // must end in "/"
    url.pathname = pathname.endsWith('/') ? pathname : `${pathname}/`
    const newHomepage = url.toString()
    fs.writeFileSync(
      'package.json',
      JSON.stringify({...pkg, homepage: newHomepage}, null, 2) + '\n',
    )
  }

  spawnSync('mkdir -p node_modules/.cache/build')

  function getRedirect(baseRoute) {
    baseRoute = baseRoute.endsWith('/') ? baseRoute : `${baseRoute}/`
    baseRoute = baseRoute.startsWith('/') ? baseRoute : `/${baseRoute}`
    return `
${baseRoute}        ${baseRoute}list              302!
${baseRoute}*       ${baseRoute}index.html        200
    `.trim()
  }

  let redirects = []

  function buildVariant(
    variant,
    {dirname = typeof variant === 'number' ? `extra-${variant}` : variant} = {},
  ) {
    console.log(`▶️  Starting build for "${variant}" in "${dirname}"`)
    try {
      updateHomepage(dirname)
      spawnSync(`node ./scripts/swap ${variant}`, {stdio: 'inherit'})
      spawnSync(`react-scripts build`, {stdio: 'inherit'})
      if (dirname) {
        spawnSync(`mv build node_modules/.cache/build/${dirname}`, {
          stdio: 'inherit',
        })
      }
      console.log(`✅  finished build for "${variant}" in "${dirname}"`)
      redirects.push(getRedirect(dirname))
    } catch (error) {
      console.log(`🚨  error building for "${variant}" in "${dirname}"`)
      throw error
    }
  }

  for (const variant of variants) {
    buildVariant(variant)
  }

  // build the final as the main thing with the homepage set to the root
  buildVariant('final', {dirname: '', baseRoute: '/'})

  console.log(
    '✅  all variants have been built, moving them to build and creating redirects file',
  )

  spawnSync('mv node_modules/.cache/build/* build/')
  fs.writeFileSync('build/_redirects', redirects.join('\n\n'))
  console.log('✅  all done. Ready to deploy')
}
