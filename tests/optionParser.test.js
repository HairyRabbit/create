/**
 * @jest
 */

test('should parse options', () => {
  const parse = require('../lib/optionParser').default
  const opts = parse(['foo', 'bar', 'baz', '--platform=github', '--qux', '--quxx'])
  expect(opts).toEqual({
    cmd: 'foo',
    cmdOptions: ['baz', '--qux', '--quxx'],
    platform: 'github',
    name: 'bar'
  })
})

test('should throw when not provide name', () => {
  const parse = require('../lib/optionParser').default
  const runner = () => { parse(['foo']) }
  expect(runner).toThrow()
})

test('should throw when not provide cmd', () => {
  const parse = require('../lib/optionParser').default
  const runner = () => { parse([]) }
  expect(runner).toThrow()
})
