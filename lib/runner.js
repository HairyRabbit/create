/**
 * run cmd and git command
 *
 * @flow
 */

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
    if(!platforms.platform) {
      throw new Error(`Can't provide platform ${platform}. \
You can write your own platform plugin or \
report it on https://github.com/HairyRabbit/create/issues/new`)
    }
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
    .then(() => platform.createRepo(name))
    .then(response => {
      process.chdir(projectDir)
      /**
       * @TODO: add run test with test options
       */
      return Promise.resolve()
        .then(() => run('git', ['init']))
        .then(() => run('git', ['remove', 'add', 'origin', response.clone_url]))
        .then(() => run('git', ['add', '.']))
        .then(() => run('git', ['commit', '-m', 'initial commit.']))
        .then(() => run('git', ['push', 'origin', 'master']))
    })
    .then(() => run('cd', [name]))
    .then(() => void 0)
}
