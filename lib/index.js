/**
 * create repo, zero configure, easy bootstrap
 *
 * @flow
 */

export type Options = {
  platform: ?string,
  name: string,
  cmd: string,
  cmdOptions: Array<string>
}

export interface Platform {
  domain: string;
  tokenFileName: string;
  token: string;
  createToken(): Promise<$PropertyType<Platform, 'token'>>;
  readToken(): Promise<$PropertyType<Platform, 'token'>>;
  createRepo(name: string, options?: Object): Promise<Object>;
}

export { default as default } from './runner'
export { default as parse } from './optionParser'
