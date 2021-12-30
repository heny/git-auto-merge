import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import merge from './merge';
import { exec, preLog, getExecTool, prompt, getGmOptions } from './utils';
import { getCurrentBranch } from './utils/git';
import { VersionType } from './common/interface';
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
  const isCurrentExist = await exec(`npm view git-auto-merge@${version}`, {
    log: false,
    silent: true,
  });
  return isCurrentExist !== '';
}

async function reacquireVersion() {
  let version = await prompt(t('PUBLISH_VERSION_EXIST'));
  let isExist = await checkVersionExist(version);
  if (isExist) version = await reacquireVersion();
  return version;
}

async function getLatestVersion() {
  const originInfo = await exec(
    `npm view git-auto-merge --registry https://registry.npmjs.org/ --json`,
    { log: false, silent: true }
  );
  const info = JSON.parse(originInfo);
  return info['dist-tags'].latest;
}

async function modifyVersion() {
  const options = getGmOptions();
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const json = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

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

  writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
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

async function publish() {
  console.time('Release it');

  await publishBefore();

  await modifyVersion();
  
  await merge();

  const curBranch = await getCurrentBranch();

  await exec('git checkout master');
  await exec('npm publish');

  await exec('git checkout ' + curBranch);

  preLog(t('PUBLISH_SUCCESS'), 'green');
  console.timeEnd('Release it');
}

export default publish;
