const {
  exec,
  checkPull,
  prompt,
  checkBranchExist,
  preLog,
  checkStatus,
  checkHasUpstream,
  getExecTool,
} = require('./utils');
const { STATUS } = require('./enum');
const t = require('../locale');

let config = {};
try {
  config = require(process.cwd() + '/gm.config.js');
} catch {}

async function pushStart() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
    silent: true,
  });
  let checkFlag = await checkBranchExist(curBranch);

  if (!checkFlag) {
    let isCreateBranch = await prompt(t('CUR_BRANCH_NOT_EXIST'), {
      type: 'confirm',
    });
    if (!isCreateBranch) shelljs.exit(1);
    await exec(`git push --set-upstream origin ${curBranch}`);
    return Promise.resolve();
  }

  let hasUpstream = await checkHasUpstream(curBranch);

  if (!hasUpstream) {
    await exec(`git push --set-upstream origin ${curBranch}`);
    return;
  }

  const pullResult = await exec('git pull', { errCaptrue: true });
  await checkPull(pullResult);

  await exec('git push');
}

async function pushHandle(isMerge) {
  if (!isMerge && getExecTool() === 'npm') console.time('Done');
  let statusResult = await checkStatus();

  if (statusResult === STATUS.UPDATED) {
    preLog(t('CONTENT_IS_UPTODATE'), 'red');
    return Promise.resolve();
  }

  if (statusResult === STATUS.PUSH || statusResult === STATUS.NONE) {
    return pushStart();
  }

  await exec('git add .');

  const commitDefault = config.commitDefault || {};
  const type = await prompt(t('SELECT_CHANGE_TYPE'), {
    type: 'list',
    choices: [
      { name: t('CHANGE_TYPE_FEAT'), value: 'feat' },
      { name: t('CHANGE_TYPE_FIX'), value: 'fix' },
      { name: t('CHANGE_TYPE_DOCS'), value: 'docs' },
      { name: t('CHANGE_TYPE_STYLE'), value: 'style' },
      { name: t('CHANGE_TYPE_REFACTOR'), value: 'refactor' },
      { name: t('CHANGE_TYPE_PERF'), value: 'perf' },
      { name: t('CHANGE_TYPE_TEST'), value: 'test' },
      { name: t('CHANGE_TYPE_CHORE'), value: 'chore' },
      { name: t('CHANGE_TYPE_REVERT'), value: 'revert' },
    ],
    default: commitDefault.type || 'feat',
  });

  const module = await prompt(t('INPUT_CHANGE_MODULE'), {
    default: commitDefault.module || 'src',
  });
  const message = await prompt(t('INPUT_CHANGE_MESSAGE'), {
    default: commitDefault.message || 'logic',
  });
  await exec(`git commit -m "${type}(${module}): ${message}"`);

  await pushStart();
  if (!isMerge && getExecTool() === 'npm') console.timeEnd('Done');
}

module.exports = { pushStart, pushHandle };
