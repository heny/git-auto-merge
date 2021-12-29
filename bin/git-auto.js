#!/usr/bin/env node
const { default: t } = require('../dist/locale');
const { default: merge } = require('../dist/src/merge.js');
const { pushHandle } = require('../dist/src/push');
const { Command } = require('commander');
const program = new Command();

program
  .command('init')
  .description(t('CLI_INIT_DESC'))
  .action(() => {
    require('../dist/src/init');
  });

program
  .command('push')
  .description(t('CLI_PUSH_DESC'))
  .option('-m --commit <commit>', t('CLI_COMMIT_DESC'))
  .option('-f --force', t('CLI_FORCE_DESC'))
  .action((options) => {
    process.env.GM_OPTIONS = JSON.stringify(options);
    pushHandle();
  });

program
  .command('merge')
  .description(t('CLI_MERGE_DESC'))
  .option('-m --commit <commit>', t('CLI_COMMIT_DESC'))
  .option('-b --branch <branch...>', t('CLI_BRANCH_DESC'))
  .option('-f --force', t('CLI_FORCE_DESC'))
  .action((options) => {
    process.env.GM_OPTIONS = JSON.stringify(options);
    merge();
  });

program.parse(process.argv);
