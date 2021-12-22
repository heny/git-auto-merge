const { exec, prompt, preLog } = require('./utils');
const shelljs = require('shelljs');
const config = require('./config');

function checkConflict(str, message) {
  return new Promise((resolve, reject) => {
    if (str.includes('CONFLICT')) {
      const errorMsg = `
        合并分支失败，请解决冲突之后，执行以下命令：
        git add .
        git merge --continue
        git push
      `;
      preLog(message || errorMsg, 'red');
      reject();
      shelljs.exit(1);
    } else {
      resolve();
    }
  });
}

async function pushCode() {
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

  const pullResult = await exec('git pull', {}, { errCaptrue: true });
  await checkConflict(pullResult, '合并分支失败，请解决冲突之后再发布');

  await exec('git push');
}

async function publish(branch, mergeBranch, branches) {
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

  const pullResult = await exec('git pull', {}, { errCaptrue: true });
  await checkConflict(pullResult);

  let mergeResult = await exec(`git merge ${mergeBranch}`, {}, { errCaptrue: true });
  await checkConflict(mergeResult);

  await exec('git push');
}

async function init() {
  console.time('Done');
  let statusResult = await exec('git status', { silent: true }, { log: false });
  if (statusResult.includes('Changes')) {
    let submitResult = await prompt('当前分支有新的内容，是否现在提交？', {
      type: 'confirm',
    });
    if (!submitResult) return;
    await pushCode();
  }

  let collectBranch = await exec('git branch', { silent: true }, { log: false });
  const branches = collectBranch.split('\n').filter(Boolean);
  const curBranch = branches.find((branch) => branch.startsWith('*')).replace('* ', '');

  let publishBranches = await prompt('请选择发布分支:', {
    type: 'checkbox',
    choices: config.choices,
    default: config.default,
  });

  await publishBranches.reduce(
    (promise, branch) => promise.then(() => publish(branch, curBranch, branches)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);
  preLog('发布成功🎉🎉🎉', 'green');
  console.timeEnd('Done');
}

init();
