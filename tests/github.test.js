/**
 * @jest
 */

beforeEach(() => {
  process.env.HOME = undefined
  jest.resetModules()
})

test('constuctor', () => {
  const Github = require('../lib/platform/github').default
  const github = new Github()
  expect(github.tokenFileName).toBe('.github')
})

test('should read token', () => {
  process.env.HOME = 'foo'
  jest.doMock('path', () => {
    return {
      resolve() {
        return 'foo'
      }
    }
  })
  jest.doMock('fs', () => {
    return {
      readFileSync() {
        return 'bar'
      },
      existsSync() {
        return true
      }
    }
  })
  const Github = require('../lib/platform/github').default
  const github = new Github()
  return expect(github.readToken()).resolves.toBe('bar')
})


test.only('should create token', () => {
  jest.doMock('path', () => {
    return {
      resolve() {
        return 'foo'
      }
    }
  })
  jest.doMock('fs', () => {
    return {
      readFileSync() {
        return ''
      },
      writeFileSync() {
        return
      },
      existsSync() {
        return false
      }
    }
  })
  jest.doMock('../lib/authReader', () => {
    return () => {
      return Promise.resolve(['foo', 'bar'])
    }
  })
  jest.doMock('@octokit/rest', () => {
    return () => ({
      authenticate() {
        return
      },
      authorization: {
        create() {
          return Promise.resolve({
            data: { token: 'bar' }
          })
        }
      }
    })
  })
  const Github = require('../lib/platform/github').default
  const github = new Github()
  return expect(github.readToken()).resolves.toBe('bar')
})


test('should create token failed', () => {
  jest.doMock('path', () => {
    return {
      resolve() {
        return 'foo'
      }
    }
  })
  jest.doMock('fs', () => {
    return {
      readFileSync() {
        return ''
      },
      writeFileSync() {
        return
      },
      existsSync() {
        return true
      }
    }
  })
  jest.doMock('../lib/authReader', () => {
    return () => {
      return Promise.resolve(['foo', 'bar'])
    }
  })
  jest.doMock('@octokit/rest', () => {
    return () => ({
      authenticate() {
        return
      },
      authorization: {
        create() {
          return Promise.reject(new Error(42))
        }
      }
    })
  })
  const Github = require('../lib/platform/github').default
  const github = new Github()
  return expect(github.readToken()).rejects.toThrow()
})

test('should create repo', () => {
  jest.doMock('@octokit/rest', () => {
    return () => ({
      authenticate() {
        return
      },
      repos: {
        create() {
          return Promise.resolve(42)
        }
      }
    })
  })
  const Github = require('../lib/platform/github').default
  const github = new Github()
  github.readToken = jest.fn(() => Promise.resolve('foo'))
  return expect(github.createRepo()).resolves.toBe(42)
})
