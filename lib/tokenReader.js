/**
 * read token from home dir
 * throw when not provide token file name or can't find config in path
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import homePath from './homePathResolver'

export default function readToken(tokenFileName: string, content?: string): string {
  if(!tokenFileName) {
    throw new Error(`The token file name was require, but got ${tokenFileName}`)
  }
  const home = homePath()
  const configFilePath = path.resolve(home, tokenFileName)
  if(!configFilePath) {
    throw new Error(`Can't find config file at ${configFilePath}`)
  }

  if(content) {
    return fs.writeFileSync(configFilePath, content, 'utf-8')
  } else {
    return fs.readFileSync(configFilePath, 'utf-8')
  }
}
