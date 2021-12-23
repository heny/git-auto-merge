const { exec, prompt, preLog, checkPull, checkStatus } = require('./utils');
const { STATUS } = require('./enum')
const shelljs = require('shelljs');
const { pushStart, pushHandle } = require('./push');

let config = {};
try {
  config = require(process.cwd() + '/gm.config.js');
} catch {}

async function publish(branch, mergeBranch) {
  preLog(`当前发布分支: ${branch}`);
  await exec(`git checkout ${branch}`);

  const pullResult = await exec(`git pull origin ${branch}`, { errCaptrue: true });
  await checkPull(pullResult);

  let mergeResult = await exec(`git merge ${mergeBranch}`, { errCaptrue: true });
  await checkPull(mergeResult);

  let hasUpstream = await exec(`git rev-parse --abbrev-ref ${branch}@{upstream}`, { 
    log: false, 
    silent: true, 
    errCaptrue: true
  });
  
  if(hasUpstream.code !== 0) {
    await exec(`git push --set-upstream origin ${branch}`);
    return;
  }

  await exec('git push');
}

async function mergeBefore() {
  let statusResult = await checkStatus();

  if (statusResult === STATUS.COMMIT) {
    let submitResult = await prompt('当前分支有新的内容，是否现在提交？', {
      type: 'confirm',
    });
    if (!submitResult) shelljs.exit(1);
    await pushHandle(true);
  }

  if(statusResult === STATUS.PUSH) {
    let submitResult = await prompt('当前分支暂存区有内容，是否现在提交？', {
      type: 'confirm',
    })
    if (submitResult) await pushStart();
  }
}

async function _merge() {
  console.time('Done');
	if (!shelljs.which('git')) {
		shelljs.echo('Sorry, this script requires git');
		shelljs.exit(1);
	}

	const collectBranch = await exec('git branch', { silent: true, log: false });
  const branches = collectBranch.split('\n').filter(Boolean).map(v => v.trim());
  const curBranch = branches.find((branch) => branch.startsWith('*')).replace(/\s|\*/g, '');

  await mergeBefore();

  const choices = branches.filter((branch) => !branch.includes(curBranch));

  const publishBranches = await prompt('请选择发布分支:', {
    type: 'checkbox',
    choices: config.mergeBranch || choices,
    default: config.mergeDefault || [],
  });

  await publishBranches.reduce(
    (promise, branch) => promise.then(() => publish(branch, curBranch)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);
  preLog('发布成功🎉🎉🎉', 'green');
  console.timeEnd('Done');
}

module.exports = _merge;
