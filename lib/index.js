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
type Options = {
  platform: string,
  token: string,
  cmd: string,
  cmdOptions: $PropertyType<Platform, 'options'>
}

interface Platform {
  domain: string;
  tokenFileName: string;
  token: string;
  createToken(): Promise<boolean>;
  readToken(): $PropertyType<Platform, 'token'>;
  createRepo(): Promise<boolean>;
}

interface Command {
  name: string;
  options: Array<string>;
  createProject(): Promise<boolean>;
}
