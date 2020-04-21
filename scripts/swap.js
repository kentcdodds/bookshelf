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

  function getMasterFileContents({
    master,
    exercise,
    final = {exportLines: null},
    extras,
  }) {
    let uncommentedLines
    if (match === 'exercise') uncommentedLines = exercise.exportLines
    if (match === 'final') {
      uncommentedLines = final.exportLines || exercise.exportLines
    }
    if (Number.isFinite(desiredECNumber)) {
      for (let num = desiredECNumber; num > 0; num--) {
        for (let num = desiredECNumber; num >= 0; num--) {
          if (num === 0) {
            uncommentedLines = final.exportLines
          } else {
            const extra = extras.find(e => e.number === num)
            if (extra) {
              uncommentedLines = extra.exportLines
            }
          }
          if (uncommentedLines) break
        }
      }
    }
    if (!uncommentedLines) {
      throw new Error(
        `No variant found to enable for "${match}" in "${master}"`,
      )
    }
    const l = lines =>
      lines
        ? lines === uncommentedLines
          ? lines.join('\n')
          : `// ${lines.join('\n// ')}`
        : ''
    const extrasLines = extras
      .map(
        ({exportLines, title}) =>
          `// 💯 ${title}\n${l(exportLines) || '// no extra credit'}`,
      )
      .join('\n\n')
    return (
      `
${l(final.exportLines) || '// no final'}

${l(exercise.exportLines) || '// no exercise'}

${extrasLines}
      `.trim() + '\n'
    )
  }

  for (const [master, {final, exercise, extras}] of Object.entries(variants)) {
    const contents = getMasterFileContents({master, final, exercise, extras})
    fs.writeFileSync(master, contents)
  }
}
