/**
 * run cmd
 *
 * @flow
 */

import { spawn } from 'child_process'

export default function run(cli: string, options?: Array<string>): Promise<Array<string>> {
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
        reject(new Error('run command ${cli} failed'), errors)
      }
    })
  })
}
