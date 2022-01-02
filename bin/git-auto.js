#!/usr/bin/env node
const { default: t } = require('../dist/locale');
const { default: merge } = require('../dist/src/merge.js');
const { default: publish } = require('../dist/src/publish');
const { pushHandle } = require('../dist/src/push');
const { Command } = require('commander');
const program = new Command();

program.name('git-auto').usage('<command> [options]');

program
  .option('-m --commit <commit>', t('CLI_COMMIT_DESC'))
  .option('-b --branch <branch...>', t('CLI_BRANCH_DESC'))
  .option('-f --force', t('CLI_FORCE_DESC'))
  .option('-l, --latest', t('CLI_PUBLISH_LATEST_DESC'))
  .option('-p --publish-branch <publish-branch>', t('CLI_PUBLISH_BRANCH_DESC'))
  .option('-t --tag [tag-name]', t('CLI_PUBLISH_TAG_DESC'))
  .option('-h --help', t('CLI_HELP_DESC'));

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
    process.env.GM_OPTIONS = JSON.stringify({ ...program.opts(), commandName: 'push' });
    pushHandle();
  });

program
  .command('merge')
  .description(t('CLI_MERGE_DESC'))
  .action(() => {
    process.env.GM_OPTIONS = JSON.stringify({ ...program.opts(), commandName: 'merge' });
    merge();
  });

program
  .command('publish')
  .description(t('CLI_PUBLISH_DESC'))
  .action(() => {
    process.env.GM_OPTIONS = JSON.stringify({ ...program.opts(), commandName: 'publish' });
    publish();
  });

program.showHelpAfterError(t('COMMANDER_ERROR_DESC'));

program.parse(process.argv);
