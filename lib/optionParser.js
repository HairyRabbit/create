/**
 * parse argv option
 *
 * @flow
 */

import argv from 'yargs-parser'
import type { Options } from './'

export default function parse(options: Array<string>): Options {
  const args = argv(options)
  let cmd, name, cmdOptions = [], platform
  for(let key in args) {
    const item = args[key]
    if('_' === key) {
      if(0 === item.length) {
        throw new Error('Project need a cli.')
      } else if(1 === item.length) {
        throw new Error('Project need a name.')
      } else {
        cmd = item.shift()
        name = item.shift()
        for(let i = 0; i < item.length; i++) {
          cmdOptions.push(item[i])
        }
      }
    } else if('platform' === key) {
      platform = item
    } else {
      if('boolean' === typeof item) {
        cmdOptions.push('--' + key)
      } else {
        cmdOptions.push(item)
      }
    }
  }

  return {
    cmdOptions,
    cmd,
    platform,
    name
  }
}
