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

  console.log(`Changing used files to those matching "${match}"`)

  function getMasterFileContents({master, exercise, final, extras}) {
    let uncommentedLines
    if (match === 'exercise') {
      uncommentedLines = exercise.exportLines
    } else if (match === 'final') {
      uncommentedLines = final ? final.exportLines : exercise.exportLines
    } else if (Number.isFinite(Number(match))) {
      const availableECs = extras
        .map(e => e.number)
        .filter(n => n <= Number(match))
      const maxEC = Math.max(...availableECs)
      const maxExtra = extras.find(e => e.number === maxEC)
      uncommentedLines = (maxExtra || final || exercise).exportLines
    } else {
      console.log('this should not happen...', match)
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
${l((final || {}).exportLines) || '// no final'}

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
