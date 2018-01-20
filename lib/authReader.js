/**
 * read username and password from stdin
 *
 * @flow
 */


export default function read(): Promise<[string, string]> {
  const State = {
    init: Symbol('init'),
    username: Symbol('username'),
    password: Symbol('password'),
    done: Symbol('done')
  }

  let username, password, state

  return new Promise(function(resolve) {
    next()

    function next(state = State.init) {
      switch(state) {
        case State.init: {
          next(State.username)
          return
        }
        case State.username: {
          process.stdout.write(`Enter your Username:\n`)
          process.stdin.on('data', resolveUsername)
          return
        }
        case State.password: {
          process.stdout.write(`Enter your Password:\n`)
          process.stdin.on('data', resolvePassword)
          return
        }
        case State.done: {
          const u = username.trim()
          const p = password.trim()
          if(u && p) {
            process.stdin.end()
            resolve([u, p])
          } else {
            process.stdout.write(`Can't read Username or password:\n\n`)
            next(State.init)
          }
          return
        }
      }
    }

    function resolveUsername(data) {
      username = data.toString()
      process.stdin.removeListener('data', resolveUsername)
      next(State.password)
    }

    function resolvePassword(data) {
      password = data.toString()
      process.stdin.removeListener('data', resolvePassword)
      next(State.done)
    }
  })
}
