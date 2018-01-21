/**
 * run cmd and git command
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { sync as which } from 'which'
import run from './cmdRunner'
import * as platforms from './platform'
import type { Options } from './'

export default function(options: Options): Promise<void> {
  let { cmd, name, platform, cmdOptions } = options

  /**
   * set default platform
   */
  if(!platform) {
    platform = platforms.github
  } else {
    if(!platforms[platform]) {
      throw new Error(`Can't provide platform ${platform}. \
You can write your own platform plugin or \
report it on https://github.com/HairyRabbit/create/issues/new`)
    }
    platform = platforms[platform]
  }
  platform = new platform()

  const whichOptions = {
    path: process.env.PATH || process.env.Path,
    nothrow: true
  }

  /**
   * ensure cmd was callable
   */
  cmd = which(cmd, whichOptions)
  if(!cmd) {
    throw new Error(`Can't find ${cmd} in your PATH`)
  }

  /**
   * ensure git was callable
   */
  const git = which('git', whichOptions)
  if(!git) {
    throw new Error(`Can't find git in your PATH`)
  }

  /**
   * run cmd and create repo
   */
  const projectDir = path.resolve(process.cwd(), name)
  cmdOptions.unshift(name)
  return Promise.resolve()
    .then(() => run(cmd, cmdOptions))
    .then(() => platform
          && 'function' === typeof platform.createRepo
          && platform.createRepo(name))
    .then(response => {
      process.chdir(projectDir)
      process.env.CI = 'travis'
      return Promise.resolve()
        .then(() => testAndConfigureCI(projectDir))
        .then(() => initialPush(
          response && response.data && response.data.ssh_url || ''
        ))
    })
    .then(() => void 0)
    .catch(error => { throw error })

  function initialPush(url: string): Promise<void> {
    if('' === url) {
      return Promise.resolve()
    } else {
      return Promise.resolve()
        .then(() => run(git, ['init']))
        .then(() => run(git, ['remote', 'add', 'origin', url]))
        .then(() => run(git, ['add', '.']))
        .then(() => run(git, ['commit', '-m', 'initial commit.']))
        .then(() => run(git, ['push', 'origin', 'master']))
    }
  }

  function testAndConfigureCI(dir: string): Promise<void> {
    const checkFiles = ['package.json', 'Cargo.toml', 'Makefile']
    const exists = checkFiles.find(cf => fs.existsSync(cf))
    const ciFileName = path.resolve(dir, '.travis.yml')
    switch(exists) {
    case checkFiles[0]: {
      fs.writeFileSync(ciFileName, `\
language: node_js

node_js: node

before_install:
  - curl -o- -L https://yarnpkg.com/install.sh | bash
  - export PATH="$HOME/.yarn/bin:$PATH"
  - "npm install -g cross-env"

cache: yarn
`, 'utf-8')
      const cmder = which('yarn') || which('npm')
      if(cmder) {
        return run(cmder, ['test']).catch(() => {})
      } else {
        return Promise.resolve()
      }
    }
    case checkFiles[1]: {
      fs.writeFileSync(ciFileName, `language: rust`, 'utf-8')
      const cmder = which('cargo')
      if(cmder) {
        return run(cmder, ['test']).catch(() => {})
      } else {
        return Promise.resolve()
      }
    }
    case checkFiles[2]: {
      const cmder = which('make')
      if(cmder) {
        return run(cmder, ['test']).catch(() => {})
      } else {
        return Promise.resolve()
      }
    }
    default: {
      return Promise.resolve()
    }
    }
  }
}
