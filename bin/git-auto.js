#!/usr/bin/env node
const { default: t } = require('../dist/locale');
const { default: merge } = require('../dist/src/merge.js');
const { default: publish } = require('../dist/src/publish');
const { pushHandle } = require('../dist/src/push');
const { Command } = require('commander');
const program = new Command();

program
  .option('-m --commit <commit>', t('CLI_COMMIT_DESC'))
  .option('-b --branch <branch...>', t('CLI_BRANCH_DESC'))
  .option('-f --force', t('CLI_FORCE_DESC'))
  .option('-l, --latest', t('CLI_PUBLISH_LATEST_DESC'))
  .option('-pb --publishBranch', t('CLI_PUBLISH_BRANCH_DESC'));

program
  .command('init')
  .description(t('CLI_INIT_DESC'))
  .action(() => {
    require('../dist/src/init');
  });

program
  .command('push')
  .description(t('CLI_PUSH_DESC'))
  .action(() => {
    process.env.GM_OPTIONS = JSON.stringify(program.opts());
    pushHandle();
  });

program
  .command('merge')
  .description(t('CLI_MERGE_DESC'))
  .action(() => {
    process.env.GM_OPTIONS = JSON.stringify(program.opts());
    merge();
  });

program
  .command('publish')
  .description(t('CLI_PUBLISH_DESC'))
  .action(() => {
    process.env.GM_OPTIONS = JSON.stringify(program.opts());
    publish();
  });

program.parse(process.argv);
