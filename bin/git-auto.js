#!/usr/bin/env node
const path = require('path')
const resolve = (...args) => path.resolve(__dirname, ...args);

require('module-alias').addAliases({
  '@root': resolve('..'),
  '@locale': resolve('../dist/locale'),
  '@src': resolve('../dist'),
});

require('../dist/bin');
