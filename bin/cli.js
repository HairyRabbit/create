#!/usr/bin/env node

const { default: main, parse } = require('../dist')
const argv = process.argv.slice(2)

main(parse(argv)).catch(error => { throw error }).catch(() => {})
