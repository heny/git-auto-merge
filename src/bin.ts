import { Command } from 'commander';
import t from '@src/locale';
import merge from './merge';
import publish from './publish';
import { pushHandle } from './push';
import { getLatestVersion } from './utils';
import { GIT_AUTO_PACKAGE_NAME } from '@src/common/constant';
import chalk from 'chalk';
import boxen from 'boxen';

const program = new Command();

async function showVersion() {
  const { version } = require('@root/package.json');
  console.log(`${t('CLI_CURRENT_VERSION')}${version}`);
  console.log(t('CLI_VERSION_GET_LATEST'));
  let latestVersion = await getLatestVersion(GIT_AUTO_PACKAGE_NAME);
  if (latestVersion) {
    if (latestVersion !== version) {
      console.log(
        boxen(`available ${chalk.red(version)} → ${chalk.green(latestVersion)}.`, {
          padding: 1,
          align: 'center',
          borderColor: 'yellow',
          title: 'Update',
          titleAlignment: 'center',
        })
      );
    } else {
      console.log(t('CLI_VERSION_IS_LATEST'));
    }
  }
}

export function registerCommand() {
  program.name('git-auto').usage('<command> [options]');

  program
    .option('-h, --help', t('CLI_HELP_DESC'), () => program.help())
    .option('-v, --version', t('CLI_VERSION_DESC'), showVersion)
    .option('--debug', t('CLI_DEBUG_DESC'))
    .option('-m, --commit <commit>', `[push] ${t('CLI_COMMIT_DESC')}`)
    .option('--part', `[push] ${t('CLI_PUBLISH_PART_DESC')}`)
    .option('-f, --force', `[push] ${t('CLI_FORCE_DESC')}`)
    .option('-b, --branch <branch...>', `[merge] ${t('CLI_BRANCH_DESC')}`)
    .option('-l, --latest', `[publish] ${t('CLI_PUBLISH_LATEST_DESC')}`)
    .option('-p, --publish-branch <publish-branch>', `[publish] ${t('CLI_PUBLISH_BRANCH_DESC')}`)
    .option('-t, --tag [tag-name]', `[publish] ${t('CLI_PUBLISH_TAG_DESC')}`)
    .action(function (_, { args }) {
      if (args.length) {
        console.log(
          `${chalk.bold.bgRed(chalk.hex('#000')(' ERROR '))} ${t('COMMANDER_ERROR_DESC')}`
        );
      }
    }); // 防止打印 help 信息

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

  program.showHelpAfterError(
    `${chalk.italic.bgGreen(chalk.black(' Tip '))} ${t('COMMANDER_ERROR_DESC')}`
  );

  program.parse(process.argv);
}

registerCommand();
