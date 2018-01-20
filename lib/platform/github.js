/**
 * Github platform
 *
 * @flow
 */

import readToken from '../tokenReader'
import readAuth from '../authReader'
import github from '@octokit/rest'
import type { Platform } from '../'

export default class Github implements Platform {
  domain: string = 'https://github.com'
  tokenFileName: string = '.github'
  username: string;
  password: string;
  gh: *;
  token: string;
  createToken() {
    return readAuth().then(([username, password]) => {
      this.username = username
      this.password = password

      this.gh = github({
        type: 'basic',
        username,
        password
      })

      return this.gh.authorization.create({
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

  createRepo(name, options) {
    if(!this.token) {
      throw new Error('Should provide token, please call createToken() at first')
    }

    return this.gh.repos.create({
      name,
      ...options
    })
  }
}
