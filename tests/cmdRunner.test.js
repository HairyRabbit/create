/**
 * @jest
 */

beforeEach(() => {
  jest.resetModules()
})

test('should resolve when run cmd', () => {
  jest.doMock('child_process', () => {
    return {
      spawn() {
        return {
          stdout: { on() {} },
          stderr: { on() {} },
          on(_, cb) { cb(0) }
        }
      }
    }
  })
  const run = require('../lib/cmdRunner').default
  return expect(run('foo')).resolves.toBe()
})


test('should reject when run cmd', () => {
  jest.doMock('child_process', () => {
    return {
      spawn() {
        return {
          stdout: { on() {} },
          stderr: { on() {} },
          on(_, cb) { cb(2) }
        }
      }
    }
  })
  const run = require('../lib/cmdRunner').default
  return expect(run('foo')).rejects.toThrow()
})
