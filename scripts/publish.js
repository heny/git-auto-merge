const fs = require('fs');
const merge = require('../lib/merge');
const { exec, preLog } = require('../lib/utils');

/**
 * patch 0.0.*
 * minor 1.*.0
 * major *.0.0
 */

function modifyVersion() {
  const packageJsonPath = process.cwd() + '/package.json';
  const json = JSON.parse(fs.readFileSync(packageJsonPath));

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
  await modifyVersion();
  await merge();

  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
    silent: true,
  });

  await exec('git checkout master');
  await exec('npm publish');
  await exec('git checkout ' + curBranch);
  preLog('发布成功', 'green');
}

publish();
