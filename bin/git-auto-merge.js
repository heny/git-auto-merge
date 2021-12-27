#!/usr/bin/env node
const { default: merge } = require('../dist/src/merge.js');
const { Command } = require('commander');
const program = new Command();

program
  .option('-m --commit <commit>', 'Commit message')
  .option('-b --branch <branch...>', 'Merge branch')
  .option('-f --force', "Automatically create branches when they don't exist")
  .action((options) => {
    merge(options);
  })
  .parse(process.argv);
