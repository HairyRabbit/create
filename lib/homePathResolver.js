/**
 * find user home path
 *
 * @flow
 */

import os from 'os'

export default function resolver() {
  const envHome = process.env.HOME

  if(envHome) {
    return envHome
  }

  return os.homedir()
}
