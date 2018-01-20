/**
 * @jest
 */

beforeEach(() => {
  jest.resetModules()
})

test('should create repo', () => {
  jest.doMock('which', () => {
    return {
      sync(cmd) { return cmd }
    }
  })
  jest.doMock('../lib/cmdRunner', () => {
    return () => Promise.resolve()
  })
  jest.doMock('@octokit/rest', () => {
    return () => ({
      repos: {
        create() {
          return Promise.resolve({
            clone_url: 'foo'
          })
        }
      }
    })
  })
  process.chdir = jest.fn(() => '')
  const options = {
    cmd: 'foo',
    name: 'bar',
    cmdOptions: []
  }
  const run = require('../lib/runner').default
  return expect(run(options)).resolves.toBe()
})

test('should reject when run cli failed', () => {
  jest.doMock('which', () => {
    return {
      sync(cmd) { return cmd }
    }
  })
  jest.doMock('../lib/cmdRunner', () => {
    return () => Promise.reject(42)
  })
  jest.doMock('@octokit/rest', () => {
    return () => ({
      repos: {
        create() {
          return Promise.resolve({
            clone_url: 'foo'
          })
        }
      }
    })
  })
  process.chdir = jest.fn(() => '')
  const options = {
    cmd: 'foo',
    name: 'bar',
    cmdOptions: []
  }
  const run = require('../lib/runner').default
  return expect(run(options)).rejects.toBe(42)
})

test('should reject when create repo failed', () => {
  jest.doMock('which', () => {
    return {
      sync(cmd) { return cmd }
    }
  })
  jest.doMock('../lib/cmdRunner', () => {
    return () => Promise.resolve()
  })
  jest.doMock('@octokit/rest', () => {
    return () => ({
      repos: {
        create() {
          return Promise.reject(42)
        }
      }
    })
  })
  process.chdir = jest.fn(() => '')
  const options = {
    cmd: 'foo',
    name: 'bar',
    cmdOptions: []
  }
  const run = require('../lib/runner').default
  return expect(run(options)).rejects.toBe(42)
})

test('should create repo when platform not matched', () => {
  const options = {
    cmd: 'foo',
    name: 'bar',
    cmdOptions: [],
    platform: 'bar'
  }
  const run = require('../lib/runner').default
  const runner = () => { run(options) }
  expect(runner).toThrow()
})
