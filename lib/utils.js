// require('console-color-mr');
const inquirer = require('inquirer');
const shelljs = require('shelljs');
const dayjs = require('dayjs');

function preLog(str, color = 'green') {
  console.log(`[${log('cxp')}/${log(dayjs().format('HH:mm:ss'))}]:`, log(str, color));
}

function exec(cmd, options) {
  return new Promise((resolve, reject) => {
    const { errCaptrue = false, log = true, ...rest } = options || {};
    if (log) preLog(cmd);
    let result = shelljs.exec(cmd, rest);
    if (errCaptrue) return resolve(result.stdout);
    if (result.code !== 0) {
      reject();
      shelljs.exit(1);
    } else {
      resolve(result.stdout);
    }
  });
};

async function prompt(message, options) {
  const { commit } = await inquirer.prompt([
    {
      type: 'input',
      message,
      name: 'commit',
      ...options,
    },
  ]);
  return commit;
};

function log(str, color) {
  const colors = {
    black: '30',
    red: '31',
    green: '32',
    yellow: '33',
    blue: '34',
    magenta: '35',
    cyan: '36',
    white: '37',
    default: '36',
  };
  const num = colors[color] || colors['default'];
  return `\x1b[${num}m${str}\x1b[0m`;
}

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

async function checkBranchExist(branch) {
  return new Promise((resolve) => {
    const result = shelljs.exec(`git rev-parse --verify "origin/${branch}"`, {
      errCaptrue: true,
      silent: true,
      log: false,
    });
    if (result.code !== 0) {
      resolve(false);
    } else {
      resolve(true);
    }
  })
}

module.exports = { log, preLog, checkConflict, exec, prompt, checkBranchExist };
