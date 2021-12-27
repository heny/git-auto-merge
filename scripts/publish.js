const fs = require('fs');
const { default: merge } = require('../dist/src/merge');
const { exec, preLog, getExecTool } = require('../dist/src/utils');

/**
 * patch 0.0.*
 * minor 1.*.0
 * major *.0.0
 */

function byTypeGetVersion(version, versionType) {
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

async function recursionVersion(version, versionType, resolve) {
  preLog(`当前检测版本：${version}`);
  const isCurrentExist = await exec(`npm view git-auto-merge@${version}`, {
    log: false,
    silent: true,
  });
  if (isCurrentExist !== '') {
    recursionVersion(byTypeGetVersion(version, versionType), versionType, resolve);
  } else {
    resolve(version);
  }
}

async function getVersionAble(version, versionType) {
  return new Promise(async (resolve) => {
    recursionVersion(version, versionType, resolve);
  });
}

async function getLatestVersion() {
  const originInfo = await exec(`npm view git-auto-merge --registry https://registry.npmjs.org/ -- 
  json`);
  return originInfo['dist-tags'].latest;
}

async function modifyVersion() {
  const packageJsonPath = process.cwd() + '/package.json';
  const json = JSON.parse(fs.readFileSync(packageJsonPath));

  let args = process.argv.slice(2);
  let version = '';

  if (args.includes('--latest')) {
    const latestVersion = await getLatestVersion();
    version = byTypeGetVersion(latestVersion);
  } else {
    let versionTypeIndex = args.findIndex((s) => s.includes('-p'));
    versionType = versionTypeIndex === -1 ? 'patch' : args[++versionTypeIndex];

    version = await getVersionAble(json.version, versionType);
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(Object.assign(json, { version }), null, 2));
  preLog(`当前发布版本：${version}`);
  return Promise.resolve();
}

async function publish() {
  console.time('Release it');
  if (getExecTool() !== 'npm') {
    preLog('请使用 npm 执行该命令', 'red');
    return;
  }

  await modifyVersion();
  await merge();

  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
    silent: true,
  });

  await exec('git checkout master');
  await exec('npm publish');
  await exec('git checkout ' + curBranch);
  preLog('发布成功🎉🎉🎉', 'green');
  console.timeEnd('Release it');
}

publish();
