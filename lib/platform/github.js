/**
 * Github platform
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import homePath from '../homePathResolver'
import readToken from '../tokenReader'
import readAuth from '../authReader'
import github from '@octokit/rest'
import type { Platform } from '../'

export default class Github implements Platform {
  domain: string = 'https://github.com'
  tokenFileName: string = '.github'

  createToken() {
    return readAuth().then(([username, password]) => {
      this.username = username
      this.password = password

      const gh = github({
        type: 'basic',
        username,
        password
      })

      return gh.authorization.create({
        scopes: [
          'repo',
          'repo_deployment',
          'user',
          'gist',
          'delete_repo',
          'notifications'
        ],
        note: 'Create tools'
      })
    }).then(res => {
      const token = res.token
      this.token = token
      readToken(this.tokenFileName, token)
      return token
    })
  }

  readToken() {
    const token = readToken(this.tokenFileName)
    if(!token) {
      return this.createToken()
    } else {
      this.token = token
      return Promise.resolve(token)
    }
  }

  createRepo() {

  }
}
