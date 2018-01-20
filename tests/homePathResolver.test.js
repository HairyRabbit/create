/**
 * @jest
 */

import { homedir } from 'os'

beforeEach(() => {
  process.env.HOME = undefined
})

test('should resolve user home path from env', () => {
  process.env.HOME = 'foo'
  const home = require('../lib/homePathResolver').default()
  expect(home).toBe('foo')
})

test('should resolve user home path from homedir()', () => {
  const home = require('../lib/homePathResolver').default()
  expect(home).toBe(homedir())
})
