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
      }
    }
  })
  const Github = require('../lib/platform/github').default
  const github = new Github()
  return expect(github.readToken()).resolves.toBe('bar')
})


test('should create token', () => {
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
      authorization: {
        create() {
          return Promise.resolve({ token: 'bar' })
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


test('should throw when create repo without gh', () => {
  const Github = require('../lib/platform/github').default
  const github = new Github()
  const runner = () => github.createRepo()
  return expect(runner).toThrow()
})

test('should create repo', () => {
  const Github = require('../lib/platform/github').default
  const github = new Github()
  github.token = 'foo'
  github.gh = {
    repos: {
      create: jest.fn(() => Promise.resolve(42))
    }
  }
  return expect(github.createRepo()).resolves.toBe(42)
})