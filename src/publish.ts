import { writeFileSync } from 'fs';
import merge from './merge';
// 修改这一行
import Push from './push';
import {
  exec,
  preLog,
  getExecTool,
  prompt,
  getGmOptions,
  getPackageJson,
  getConfig,
  wrapHandle,
  getLatestVersion,
  printInline,
  isCommandAvailable
} from './utils';
import chalk from 'chalk';
import { getCurrentBranch, getOriginBranches } from './utils/git';
import { PACKAGE_JSON_PATH, VERSION_TYPE } from './common/constant';
import semver from 'semver';
import t from '@src/locale';

class Publish {
  private async checkVersionExist(version?: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const json = getPackageJson();
      version = version || json.version;

      const isCurrentExist = await exec(`npm view ${json.name}@${version}`, {
        log: false,
        errCaptrue: true,
      });

      if (isCurrentExist.code !== 0) resolve(false);
      resolve(isCurrentExist.stdout !== '');
    });
  }

  private async reacquireVersion(): Promise<string> {
    let version = await prompt(t('PUBLISH_VERSION_EXIST'));
    if (!semver.valid(version) || (await this.checkVersionExist(version)))
      version = await this.reacquireVersion();
    return version;
  }

  private async modifyVersion(): Promise<void> {
    const options = getGmOptions();
    const config = getConfig();
    const json = getPackageJson();

    const latestVersion = await getLatestVersion();
    if (options.latest || config?.publish?.latest) {
      json.version = semver.inc(latestVersion, 'patch');
    } else {
      const choices = VERSION_TYPE.map((item) =>
        semver.inc(latestVersion, item, item !== 'prerelease' ? 'alpha' : '')
      ).map((value, i) => ({
        title: `${VERSION_TYPE[i]} ${value}`,
        value,
      }));

      json.version = await prompt(t('PUBLISH_SELECT_VERSION'), {
        type: 'select',
        choices: choices.concat({
          title: 'custom',
          value: 'custom',
        }),
      });

      if (json.version === 'custom') {
        let version = await prompt(t('PUBLISH_INPUT_VERSION'));
        if (!semver.valid(version) || (await this.checkVersionExist(version)))
          version = await this.reacquireVersion();
        json.version = version;
      }
    }

    writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(json, null, 2));
    preLog(chalk.cyan(t('PUBLISH_CURRENT_VERSION', { version: json.version })));
  }

  private async publishBefore(): Promise<void> {
    // 检查命令
    printInline(chalk.cyan(t('PUBLISH_CHECK_REGISTRY_TYPE')))
    if (getExecTool() !== 'npm') {
      preLog(chalk.red(t('PUBLISH_NOT_NPM')));
      process.exit(0);
    }

    // 检查注册表
    printInline(chalk.cyan(t('PUBLISH_CHECK_REGISTRY')))
    let npmRegistry = await exec('npm config get registry', { log: false });
    if (npmRegistry.trim() !== 'https://registry.npmjs.org/') {
      preLog(chalk.red(t('PUBLISH_NPM_REGISTRY_ERROR')));
      process.exit(0);
    }

    // 检查登录状态
    printInline(chalk.cyan(t('PUBLISH_CHECK_LOGIN')))
    let loginStatus = await exec('npm whoami', { log: false, errCaptrue: true });
    if (loginStatus.code !== 0) {
      preLog(chalk.red(t('PUBLISH_NPM_LOGIN_ERROR')));
      process.exit(0);
    }
  }

  private async publishBranch(): Promise<void> {
    const options = getGmOptions();
    const config = getConfig();

    let publishBranch = options.publishBranch || config?.publish?.branch || '';
    const curBranch = await getCurrentBranch();

    if (!publishBranch) {
      const choices = await getOriginBranches();
      switch (choices.length) {
        case 0:
          publishBranch = curBranch;
          break;
        case 1:
          publishBranch = choices[0];
          break;
        default:
          publishBranch = await prompt(t('PUBLISH_SELECT_BRANCH'), {
            type: 'select',
            choices: choices.map((value) => ({ title: value, value })),
          });
      }
    }

    const isCurrentBranch = curBranch === publishBranch;

    if (isCurrentBranch) {
      await Push.pushHandle();
    } else {
      process.env.PUBLISH_BRANCH = publishBranch;
      await merge();
      await exec(`git checkout ${publishBranch}`);
    }

    await exec('npm publish');
    if (!isCurrentBranch) await exec('git checkout ' + curBranch);
  }

  private async createTag(): Promise<void> {
    const options = getGmOptions();

    const curVersion = `v${getPackageJson().version}`;
    let tagName = typeof options.tag === 'string' ? options.tag : curVersion;
    let desc = curVersion;

    const tag = getConfig()?.publish?.tag;
    if (!tag && !options.tag) {
      tagName = await prompt(t('PUBLISH_CREATE_NAME'), { initial: curVersion });
      desc = await prompt(t('PUBLISH_CREATE_DESC'), { initial: curVersion });
    }

    await exec(`git tag -a ${tagName} -m ${desc}`);
    await exec(`git push origin ${tagName}`);
    preLog(chalk.cyan(t('PUBLISH_CREATE_TAG_SUCCESS', { tagName })));
  }

  private async publishAfter(): Promise<void> {
    const tag = getConfig()?.publish?.tag;
    if (tag) {
      await this.createTag();
    } else {
      let isCreateTag = await prompt(t('PUBLISH_CREATE_TAG'), { type: 'confirm', initial: true });
      if (isCreateTag) await this.createTag();
    }
  }

  private async addChangeLog(): Promise<void> {
    const isChangeLog = await prompt(t('CLI_HAS_CHANGELOG'), {
      type: 'confirm',
      initial: true
    })
    if (!isChangeLog) return;
    preLog(chalk.cyan(t('CLI_START_CHANGELOG')))

    const hasAble = await isCommandAvailable('conventional-changelog --version')

    if (!hasAble) {
      console.log(chalk.red(t('CLI_COMMAND_CHANGELOG_NOT')))
      process.exit(0)
    }

    await exec('conventional-changelog -p angular -i CHANGELOG.md -s', { log: false })
  }

  public async publish(): Promise<void> {
    await wrapHandle(async () => {
      preLog(chalk.cyan(t('PUBLISH_CALCULATING')));
      await this.publishBefore();

      preLog(chalk.cyan(t('PUBLISH_START_ORIGIN_VERSION')))
      if (await this.checkVersionExist()) {
        await this.modifyVersion();
      }

      await this.addChangeLog()

      await this.publishBranch();

      preLog(chalk.green(t('PUBLISH_SUCCESS')));

      await this.publishAfter();
    }, 'publish');
  }
}

export default new Publish().publish;
