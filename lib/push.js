const { exec, checkPull, prompt, checkBranchExist, preLog, checkStatus } = require('./utils');
const { STATUS } = require('./enum')

async function pushStart() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {log: false, silent: true});
  let checkFlag = await checkBranchExist(curBranch);

  if (!checkFlag) {
    let isCreateBranch = await prompt('当前分支不存在，是否立即创建？', {
      type: 'confirm',
    });
    if (!isCreateBranch) shelljs.exit(1);
    await exec(`git push --set-upstream origin ${curBranch}`);
    return Promise.resolve();
  }

  const pullResult = await exec(`git pull origin ${curBranch}`, { errCaptrue: true });
  await checkPull(pullResult);

  let hasUpstream = await exec(`git rev-parse --abbrev-ref ${curBranch}@{upstream}`, { 
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

async function pushHandle(isMerge) {
  if(!isMerge) console.time('Done');
  let statusResult = await checkStatus();

  if(statusResult === STATUS.UPDATED) {
    preLog('当前分支内容是最新的，无需推送', 'red');
    return Promise.resolve();
  }

  if(statusResult === STATUS.PUSH) {
    return pushStart();
  }

	await exec('git add .');

  const type = await prompt('请选择需要变更的类型：', {
    type: 'list',
    choices: [
      { name: 'feat：新功能（feature）', value: 'feat' },
      { name: 'fix：修补bug', value: 'fix' },
      { name: 'docs：文档（documentation）', value: 'docs' },
      { name: 'style：美化（不影响代码运行）', value: 'style' },
      { name: 'refactor：重构（即不是新增功能，也不是修补bug的代码变动）', value: 'refactor' },
      { name: 'perf：优化（对代码运行负面影响，但不会影响代码运行）', value: 'perf' },
      { name: 'test：单元测试', value: 'test' },
      { name: 'chore：构建过程或辅助工具的变动', value: 'chore' },
      { name: 'revert：回滚', value: 'revert' },
    ],
  });
  const module = await prompt('请输入需要变更的模块：', { default: 'src' });
  const message = await prompt('请输入提交信息：', { default: 'logic' });
  await exec(`git commit -m "${type}(${module}): ${message}"`);
  
  await pushStart();
  if(!isMerge) console.timeEnd('Done');
}

module.exports = { pushStart, pushHandle }
