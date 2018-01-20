/**
 * @jest
 */

beforeEach(() => {
  process.env.HOME = undefined
  jest.resetModules()
})

test('should return token string', () => {
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
  const read = require('../lib/tokenReader.js').default
  expect(read('foo')).toBe('bar')
})

test('should throw when not provide token file name', () => {
  const read = require('../lib/tokenReader.js').default
  const runner = () => {read()}
  expect(runner).toThrow(`The token file name was require, but got undefined`)
})

test('should throw when not resolve home path', () => {
  process.env.HOME = 'foo'
  jest.doMock('path', () => {
    return {
      resolve() {
        return null
      }
    }
  })
  const read = require('../lib/tokenReader.js').default
  const runner = () => {read()}
  expect(runner).toThrow()
})

test('should write token string', () => {
  process.env.HOME = 'foo'
  const writer = jest.fn()
  jest.doMock('path', () => {
    return {
      resolve() {
        return 'foo'
      }
    }
  })
  jest.doMock('fs', () => {
    return {
      writeFileSync() {
        writer()
      }
    }
  })

  const read = require('../lib/tokenReader.js').default
  read('foo', 'bar')
  expect(writer).toBeCalled()
})
