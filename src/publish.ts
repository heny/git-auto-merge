import { writeFileSync } from 'fs';
import merge from './merge';
import { pushHandle } from './push';
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
} from './utils';
import chalk from 'chalk';
import { getCurrentBranch, getOriginBranches } from './utils/git';
import { VersionType } from './common/interface';
import { PACKAGE_JSON_PATH } from './common/constant';
import t from '@src/locale';

/**
 * patch 0.0.*
 * minor 1.*.0
 * major *.0.0
 */

function byTypeGetVersion(version: any, versionType: VersionType) {
  version = version.split('.');
  switch (versionType) {
    case 'minor':
      version[1] = ++version[1];
      break;
    case 'major':
      version[0] = ++version[0];
      break;
    case 'patch':
    default:
      version[2] = ++version[2];
  }
  return version.join('.');
}

async function checkVersionExist(version: string) {
  if (!version) return true;
  const json = getPackageJson();
  const isCurrentExist = await exec(`npm view ${json.name}@${version}`, {
    log: false,
    errCaptrue: true,
  });
  if (isCurrentExist.code !== 0) return false;
  return isCurrentExist.stdout !== '';
}

async function reacquireVersion() {
  let version = await prompt(t('PUBLISH_VERSION_EXIST'));
  let isExist = await checkVersionExist(version);
  if (isExist) version = await reacquireVersion();
  return version;
}

async function modifyVersion() {
  const options = getGmOptions();
  const config = getConfig();
  const json = getPackageJson();

  const latestVersion = await getLatestVersion();
  if (options.latest || config?.publish?.latest) {
    json.version = byTypeGetVersion(latestVersion, 'patch');
  } else {
    const versionType = ['Patch', 'Minor', 'Major'] as const;
    const choices = versionType
      .map((item) => byTypeGetVersion(latestVersion, item.toLowerCase() as VersionType))
      .map((value, i) => ({ title: `${versionType[i]} (${value})`, value }));

    json.version = await prompt(t('PUBLISH_SELECT_VERSION'), {
      type: 'select',
      choices: choices.concat({ title: t('PUBLISH_CUSTOM_VERSION'), value: 'custom' }),
    });

    if (json.version === 'custom') {
      let version = await prompt(t('PUBLISH_INPUT_VERSION'));
      let isExist = await checkVersionExist(version);
      if (!version || isExist) version = await reacquireVersion();
      json.version = version;
    }
  }

  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(json, null, 2));
  preLog(chalk.cyan(t('PUBLISH_CURRENT_VERSION', { version: json.version })));
}

async function publishBefore() {
  // check command
  if (getExecTool() !== 'npm') {
    preLog(chalk.red(t('PUBLISH_NOT_NPM')));
    process.exit(0);
  }

  // check registry
  let npmRegistry = await exec('npm config get registry', { log: false });
  if (npmRegistry.trim() !== 'https://registry.npmjs.org/') {
    preLog(chalk.red(t('PUBLISH_NPM_REGISTRY_ERROR')));
    process.exit(0);
  }

  // check login
  let loginStatus = await exec('npm whoami', { log: false, errCaptrue: true });
  if (loginStatus.code !== 0) {
    preLog(chalk.red(t('PUBLISH_NPM_LOGIN_ERROR')));
    process.exit(0);
  }
}

async function publishBranch() {
  const options = getGmOptions();
  const config = getConfig();

  let publishBranch = options.publishBranch || config?.publish?.branch || '';
  const curBranch = await getCurrentBranch();

  if (!publishBranch) {
    const choices = await getOriginBranches();
    if (choices.length === 1) {
      publishBranch = choices[0];
    } else if (!choices.length) {
      publishBranch = curBranch;
    } else {
      publishBranch = await prompt(t('PUBLISH_SELECT_BRANCH'), {
        type: 'select',
        choices: choices.map((value) => ({ title: value, value })),
      });
    }
  }

  const isCurrentBranch = curBranch === publishBranch;

  if (isCurrentBranch) {
    await pushHandle();
  } else {
    process.env.PUBLISH_BRANCH = publishBranch;
    await merge();
    await exec(`git checkout ${publishBranch}`);
  }

  await exec('npm publish');
  if (!isCurrentBranch) await exec('git checkout ' + curBranch);
}

async function createTag() {
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

async function publishAfter() {
  const tag = getConfig()?.publish?.tag;
  if (tag) {
    await createTag();
  } else {
    let isCreateTag = await prompt(t('PUBLISH_CREATE_TAG'), { type: 'confirm', initial: true });
    if (isCreateTag) await createTag();
  }
}

async function publish() {
  await wrapHandle(async function () {
    preLog(chalk.cyan(t('PUBLISH_CALCULATING')));
    await publishBefore();

    await modifyVersion();
    await publishBranch();

    preLog(chalk.green(t('PUBLISH_SUCCESS')));

    await publishAfter();
  }, 'publish');
}

export default publish;
