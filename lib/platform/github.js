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
  createToken(): Promise<string> {
    return readAuth().then(([username, password]) => {
      this.username = username
      this.password = password

      this.gh = github()

      this.gh.authenticate({
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
    }).then(response => {
      const token = response.data.token
      this.token = token
      readToken(this.tokenFileName, token)
      return token
    })
  }

  readToken(): Promise<string> {
    const token = readToken(this.tokenFileName)
    if(!token) {
      return this.createToken()
    } else {
      this.token = token
      return Promise.resolve(token)
    }
  }

  createRepo(name: string, options?: Object = {}): Promise<Object> {
    return this.readToken().then(token => {
      if(!this.gh) {
        this.gh = github()

        this.gh.authenticate({
          type: 'token',
          token
        })
      }
      return this.gh.repos.create({
        name,
        ...options
      })
    }).catch(error => {
      console.error(error)
      throw error
    })
  }
}
