const { exec, prompt, preLog, checkConflict, checkBranchExist } = require('./utils');
const shelljs = require('shelljs');
const pushCode = require('./push');

let config = {};
try {
  config = require(process.cwd() + '/gm.config.js');
} catch {}

async function publish(branch, mergeBranch, branches) {
  let hasBranch = await checkBranchExist(branch);
  if(!hasBranch) {
    preLog('当前分支不存在', 'red');
    shelljs.exit(1);
  }

  preLog(`当前发布分支: ${branch}`);
  await exec(`git checkout ${branch}`);

  // branches = branches.reduce((preBranch, curBranch) => {
  //   if (!curBranch.includes(mergeBranch)) {
  //     preBranch.push(curBranch.trim());
  //   }
  //   return preBranch;
  // }, []);

  // const choices = [curBranch].concat(branches);

  // let mergeBranch = await prompt('请选择需要合并的分支：', {
  //   type: 'list',
  //   choices,
  // });

  const pullResult = await exec('git pull', { errCaptrue: true });
  await checkConflict(pullResult);

  let mergeResult = await exec(`git merge ${mergeBranch}`, { errCaptrue: true });
  await checkConflict(mergeResult);

  await exec('git push');
}

async function merge() {
  console.time('Done');
	if (!shelljs.which('git')) {
		shelljs.echo('Sorry, this script requires git');
		shelljs.exit(1);
	}

	let collectBranch = await exec('git branch', { silent: true, log: false });
  const branches = collectBranch.split('\n').filter(Boolean);
  const curBranch = branches
    .find((branch) => branch.startsWith('*'))
    .replace('* ', '')
    .trim();

  let statusResult = await exec('git status', { silent: true, log: false });
  if (statusResult.includes('Changes')) {
    let submitResult = await prompt('当前分支有新的内容，是否现在提交？', {
      type: 'confirm',
    });
    if (!submitResult) return;
    await pushCode();
  }

  let publishBranches = await prompt('请选择发布分支:', {
    type: 'checkbox',
    choices: config.mergeBranch,
    default: config.mergeDefault || [],
  });

  await publishBranches.reduce(
    (promise, branch) => promise.then(() => publish(branch, curBranch, branches)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);
  preLog('发布成功🎉🎉🎉', 'green');
  console.timeEnd('Done');
}

module.exports = merge;
