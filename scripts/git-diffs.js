const {getVariants} = require('./utils')

const variants = getVariants()

const [, , end, start = 'exercise'] = process.argv

function getVariant(variant, requested) {
  if (variant[requested]) return variant[requested]
  return variant.extras.find(e => e.number === Number(requested))
}

function getFilesForVariant() {
  return Object.values(variants)
    .map(variant => {
      const before = getVariant(variant, start)
      const after = getVariant(variant, end)
      return {
        before: before ? before.file : null,
        after: after ? after.file : null,
      }
    })
    .filter(({before, after}) => before && after)
}

for (const {before, after} of getFilesForVariant()) {
  console.log(`git diff --no-index "${before}" "${after}"`)
}
