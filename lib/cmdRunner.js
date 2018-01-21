/**
 * run cmd
 *
 * @flow
 */

import { spawn } from 'child_process'

export default function run(cli: string, options?: Array<string>): Promise<void> {
  return new Promise(function(resolve, reject) {
    const cmd = spawn(cli, options)
    const errors = []
    cmd.stdout.on('data', data => {
      process.stdout.write(data)
    })
    cmd.stderr.on('data', data => {
      process.stderr.write(data)
      errors.push(data.toString())
    })
    cmd.on('close', (code) => {
      if(0 === code) {
        resolve()
      } else {
        const error = new Error(`run command ${cli} failed`)
        // $FlowFixMe
        error.errors = errors
        reject(error)
      }
    })
  })
}
