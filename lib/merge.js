const { exec, prompt, preLog, checkConflict, checkBranchExist } = require('./utils');
const shelljs = require('shelljs');
const { pushStart, pushHandle } = require('./push');

let config = {};
try {
  config = require(process.cwd() + '/gm.config.js');
} catch {}

async function publish(branch, mergeBranch) {
  let hasBranch = await checkBranchExist(branch);
  if(!hasBranch) {
    preLog('当前分支不存在', 'red');
    shelljs.exit(1);
  }

  preLog(`当前发布分支: ${branch}`);
  await exec(`git checkout ${branch}`);

  const pullResult = await exec('git pull', { errCaptrue: true });
  await checkConflict(pullResult);

  let mergeResult = await exec(`git merge ${mergeBranch}`, { errCaptrue: true });
  await checkConflict(mergeResult);

  await exec('git push');
}

async function mergeBefore() {
  let statusResult = await exec('git status', { silent: true, log: false });

  if (statusResult.includes('Changes')) {
    let submitResult = await prompt('当前分支有新的内容，是否现在提交？', {
      type: 'confirm',
    });
    if (!submitResult) shelljs.exit(1);
    await pushHandle();
  }

  if(statusResult.includes('to publish your local commits')) {
    let submitResult = await prompt('当前分支暂存区有内容，是否现在提交？', {
      type: 'confirm',
    })
    if (submitResult) await pushStart();
  }
}

async function merge() {
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

module.exports = merge;
