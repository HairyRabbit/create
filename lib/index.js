/**
 * create repo, zero configure, easy bootstrap
 *
 * @flow
 */

/**
 * command options
 *
 * platform - git platform, default to Github
 * token - person token, token string or a file path, default to ~/.github
 */
export type Options = {
  platform: string,
  token: string,
  cmd: string,
  cmdOptions: $PropertyType<Platform, 'options'>
}

export interface Platform {
  domain: string;
  tokenFileName: string;
  token: string;
  createToken(): Promise<$PropertyType<Platform, 'token'>>;
  readToken(): Promise<$PropertyType<Platform, 'token'>>;
  createRepo(): Promise<Object>;
}

export { default as default } from './runner'
export { default as parse } from './optionParser'
