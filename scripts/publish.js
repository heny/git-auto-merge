const fs = require('fs');
const { default: merge } = require('../dist/src/merge');
const { exec, preLog, getExecTool, prompt } = require('../dist/src/utils');
const { Command } = require('commander');

const program = new Command();

program.option('-l, --latest', '发布最新版本').parse(process.argv);

/**
 * patch 0.0.*
 * minor 1.*.0
 * major *.0.0
 */

function byTypeGetVersion(version, versionType) {
  version = version.split('.');
  switch (versionType.toLowerCase()) {
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

async function getLatestVersion() {
  const originInfo = await exec(
    `npm view git-auto-merge --registry https://registry.npmjs.org/ --json`,
    { log: false, silent: true }
  );
  const info = JSON.parse(originInfo);
  return info['dist-tags'].latest;
}

async function modifyVersion() {
  const options = program.opts();
  const packageJsonPath = process.cwd() + '/package.json';
  const json = JSON.parse(fs.readFileSync(packageJsonPath));

  const latestVersion = await getLatestVersion();
  if (options.latest) {
    json.version = byTypeGetVersion(latestVersion, 'patch');
  } else {
    const versionType = ['Patch', 'Minor', 'Major'];
    const choices = versionType
      .map((item) => byTypeGetVersion(latestVersion, item))
      .map((value, i) => ({ name: `${versionType[i]} (${value})`, value }));

    json.version = await prompt('请选择发布版本：', {
      type: 'list',
      choices: choices.concat({ name: 'Custom Version', value: 'custom' }),
    });

    if (version === 'custom') {
      json.version = await prompt('请输入版本号：');
    }
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
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
