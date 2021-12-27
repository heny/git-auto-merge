#!/usr/bin/env node
const { pushHandle } = require('../dist/src/push');
const { Command } = require('commander');
const program = new Command();

program
  .option('-m --commit <commit>', 'Commit message')
  .option('-f --force', "Automatically create branches when they don't exist")
  .action((options) => {
    pushHandle(options);
  })
  .parse(process.argv);
