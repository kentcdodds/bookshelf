const fs = require('fs')
const inquirer = require('inquirer')
const {spawnSync, getVariants, getExtraCreditTitles} = require('./utils')

const branch = spawnSync('git rev-parse --abbrev-ref HEAD')
if (branch === 'master') {
  throw new Error('Cannot run swap on master as there are no exercises.')
}

go()

async function go() {
  let {2: match} = process.argv

  const allowedTypes = [/^exercise$/, /^final$/, /^\d+$/]

  const variants = getVariants()
  const maxExtra = Math.max(
    ...Object.values(variants)
      .flatMap(v => v.extras)
      .map(e => e.number),
  )

  const extraCreditTitles = getExtraCreditTitles()

  if (!match) {
    const prompt = await inquirer.prompt([
      {
        name: 'matchVal',
        message: `Which modules do you want loaded?`,
        type: 'list',
        choices: [
          {name: 'Exercise', value: 'exercise'},
          {name: 'Final', value: 'final'},
          ...Array.from({length: maxExtra}, (v, i) => ({
            name: `Extra Credit ${i + 1}: ${extraCreditTitles[i]}`,
            value: i + 1,
          })),
        ],
      },
    ])
    match = prompt.matchVal
  }

  if (!allowedTypes.some(t => t.test(match))) {
    throw new Error(
      `The given match of "${match}" is not one of the allowed types of: ${allowedTypes.join(
        ', ',
      )}`,
    )
  }

  const desiredECNumber = Number(match)

  console.log(`Changing used files to those matching "${match}"`)

  function getMasterFileContents({master, final, exercise, extras}) {
    let chosenLine
    if (match === 'exercise') chosenLine = exercise.exportLine
    if (match === 'final') chosenLine = final.exportLine
    if (Number.isFinite(desiredECNumber)) {
      for (let num = desiredECNumber; num > 0; num--) {
        for (let num = desiredECNumber; num >= 0; num--) {
          if (num === 0) {
            chosenLine = final.exportLine
          } else {
            const extra = extras.find(e => e.number === num)
            if (extra) {
              chosenLine = extra.exportLine
            }
          }
          if (chosenLine) break
        }
      }
    }
    if (!chosenLine) {
      throw new Error(
        `No variant found to enable for "${match}" in "${master}"`,
      )
    }
    const l = i => (i === chosenLine ? i : `// ${i}`)
    const extrasLines = extras
      .map(({exportLine, title}) => `// 💯 ${title}\n${l(exportLine)}`)
      .join('\n\n')
    return (
      `
${l(final.exportLine)}

${l(exercise.exportLine)}

${extrasLines}
      `.trim() + '\n'
    )
  }

  for (const [master, {final, exercise, extras}] of Object.entries(variants)) {
    const contents = getMasterFileContents({master, final, exercise, extras})
    fs.writeFileSync(master, contents)
  }
}
