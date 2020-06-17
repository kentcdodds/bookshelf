const {getVariants} = require('./utils')

const variants = getVariants()

function getFilesForVariant(number) {
  if (number === 'final') {
    return Object.values(variants)
      .map(({exercise, final}) => {
        if (final) {
          return {
            before: exercise.file,
            after: final.file,
          }
        }
        return null
      })
      .filter(Boolean)
  }
  return Object.values(variants)
    .map(({exercise, extras}) => {
      const extra = extras.find(e => e.number === Number(number))
      if (extra) {
        return {
          before: exercise.file,
          after: extra.file,
        }
      }
      return null
    })
    .filter(Boolean)
}

for (const {before, after} of getFilesForVariant(process.argv[2])) {
  console.log(`git diff --no-index "${before}" "${after}"`)
}
