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
} from './utils';
import { getCurrentBranch, getOriginBranches } from './utils/git';
import { VersionType } from './common/interface';
import { PACKAGE_JSON_PATH } from './common/constant';
import t from '../locale';

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
    silent: true,
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

async function getLatestVersion() {
  const json = getPackageJson();
  const originInfo = await exec(
    `npm view ${json.name} --registry https://registry.npmjs.org/ --json`,
    { log: false, silent: true, errCaptrue: true }
  );
  if (originInfo.code !== 0) return '0.0.0';
  const info = JSON.parse(originInfo.stdout);
  return info['dist-tags'].latest;
}

async function modifyVersion() {
  const options = getGmOptions();
  const json = getPackageJson();

  const latestVersion = await getLatestVersion();
  if (options.latest) {
    json.version = byTypeGetVersion(latestVersion, 'patch');
  } else {
    const versionType = ['Patch', 'Minor', 'Major'] as const;
    const choices = versionType
      .map((item) => byTypeGetVersion(latestVersion, item.toLowerCase() as VersionType))
      .map((value, i) => ({ name: `${versionType[i]} (${value})`, value }));

    json.version = await prompt(t('PUBLISH_SELECT_VERSION'), {
      type: 'list',
      choices: choices.concat({ name: t('PUBLISH_CUSTOM_VERSION'), value: 'custom' }),
    });

    if (json.version === 'custom') {
      let version = await prompt(t('PUBLISH_INPUT_VERSION'));
      let isExist = await checkVersionExist(version);
      if (!version || isExist) version = await reacquireVersion();
      json.version = version;
    }
  }

  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(json, null, 2));
  preLog(t('PUBLISH_CURRENT_VERSION', { version: json.version }));
  return Promise.resolve();
}

async function publishBefore() {
  // check command
  if (getExecTool() !== 'npm') {
    preLog(t('PUBLISH_NOT_NPM'), 'red');
    process.exit(0);
  }

  // check registry
  let npmRegistry = await exec('npm config get registry', { log: false, silent: true });
  if (npmRegistry.trim() !== 'https://registry.npmjs.org/') {
    preLog(t('PUBLISH_NPM_REGISTRY_ERROR'), 'red');
    process.exit(0);
  }

  // check login
  let loginStatus = await exec('npm whoami', { log: false, silent: true, errCaptrue: true });
  if (loginStatus.code !== 0) {
    preLog(t('PUBLISH_NPM_LOGIN_ERROR'), 'red');
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
        type: 'list',
        choices,
      });
    }
  }

  const isCurrentBranch = curBranch === publishBranch;

  if (isCurrentBranch) {
    await pushHandle();
  } else {
    await merge();
    await exec(`git checkout ${publishBranch}`);
  }

  await exec('npm publish');
  if (!isCurrentBranch) await exec('git checkout ' + curBranch);
}

async function createTag() {
  const curVersion = `v${getPackageJson().version}`;
  let tagName = curVersion;
  let desc = curVersion;

  const autoCreateTag = getConfig()?.publish?.autoCreateTag;
  if (!autoCreateTag) {
    tagName = await prompt(t('PUBLISH_CREATE_NAME'), { default: curVersion });
    desc = await prompt(t('PUBLISH_CREATE_DESC'), { default: curVersion });
  }

  await exec(`git tag -a ${tagName} -m ${desc}`);
  await exec(`git push origin ${tagName}`);
}

async function publishAfter() {
  const autoCreateTag = getConfig()?.publish?.autoCreateTag;
  if (autoCreateTag) {
    await createTag();
  } else {
    let isCreateTag = await prompt(t('PUBLISH_CREATE_TAG'), { type: 'confirm' });
    if (isCreateTag) await createTag();
  }
}

async function publish() {
  console.time('Release it');

  await publishBefore();

  await modifyVersion();

  await publishBranch();

  preLog(t('PUBLISH_SUCCESS'), 'green');

  await publishAfter();

  console.timeEnd('Release it');
}

export default publish;
