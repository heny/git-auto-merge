const fs = require('fs');
const { default: merge } = require('../dist/src/merge');
const { exec, preLog, getExecTool } = require('../dist/src/utils');

/**
 * patch 0.0.*
 * minor 1.*.0
 * major *.0.0
 */

async function modifyVersion() {
  const packageJsonPath = process.cwd() + '/package.json';
  const json = JSON.parse(fs.readFileSync(packageJsonPath));

  const isCurrentExist = await exec(`npm view git-auto-merge@${json.version}`, {
    log: false,
    silent: true,
  });
  if (isCurrentExist === '') return json.version;

  let version = json.version.split('.');
  let versionType = process.argv.slice(2)[0];
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

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(Object.assign(json, { version: version.join('.') }), null, 2)
  );
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
