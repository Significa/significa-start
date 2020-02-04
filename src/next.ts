import execa from 'execa'
import path from 'path'

import addScript from './lib/addScript'
import log from './lib/log'
import copyDir from './lib/copyDir'

const scripts: { [key: string]: string } = {
  dev: 'next dev',
  build: 'next build',
  start: 'next start',
}

const dependencies: string[] = [
  'react',
  'react-dom',
  'next',
  'styled-components',
  'dotenv',
]

const devDependencies: string[] = [
  'typescript',
  '@types/react',
  '@types/node',
  '@types/styled-components',
  '@svgr/webpack',
  'tsconfig-paths-webpack-plugin',
]

async function next(name: string) {
  const cwd = path.join(process.cwd(), name)

  const spinner = log.step('Creating folder and initializing project')
  await execa('mkdir', [name])
  await execa('npm', ['init', '-y'], { cwd })

  log.step('Adding scripts to package.json')
  Object.keys(scripts).forEach(async key => {
    await addScript(`${cwd}/package.json`, key, scripts[key])
  })

  log.step('Adding project files')
  await copyDir(`${path.join(__dirname, '../templates/next')}`, cwd)

  log.step('Installing dependencies')
  await execa('npm', ['i', '--save', ...dependencies], { cwd })
  await execa('npm', ['i', '--save-dev', ...devDependencies], { cwd })

  spinner.succeed()
}

export default next