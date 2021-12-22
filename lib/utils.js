// require('console-color-mr');
const inquirer = require('inquirer');
const shelljs = require('shelljs');
const dayjs = require('dayjs');

function preLog(str, color = 'green') {
  console.log(`[${log('cxp')}/${log(dayjs().format('HH:mm:ss'))}]:`, log(str, color));
}

exports.exec = function exec(cmd, execOptions, options) {
  return new Promise((resolve, reject) => {
    const { errCaptrue = false, log = true } = options || {};
    if (log) preLog(cmd);
    let result = shelljs.exec(cmd, execOptions);
    if (errCaptrue) return resolve(result.stdout);
    if (result.code !== 0) {
      reject();
      shelljs.exit(1);
    } else {
      resolve(result.stdout);
    }
  });
};

exports.prompt = async function prompt(message, options) {
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

exports.log = log;
exports.preLog = preLog;
