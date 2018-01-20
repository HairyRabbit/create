/**
 * @jest
 */

test('should return username and password', () => {
  const read = require('../lib/authReader').default
  const promise = read()
  process.stdin.push('foo')
  process.stdin.push('bar')
  return expect(promise).resolves.toEqual(['foo', 'bar'])
})
