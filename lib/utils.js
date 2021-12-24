const inquirer = require('inquirer')
const shelljs = require('shelljs')
const dayjs = require('dayjs')
const { STATUS } = require('./enum')
const t = require('../locale')

function preLog(str, color = 'green') {
  console.log(`[${log('web')}/${log(dayjs().format('HH:mm:ss'))}]:`, log(str, color))
}

function getExecTool() {
  const path = process.env.npm_execpath
  if (path.includes('yarn')) return 'yarn'
  return 'npm'
}

function exec(cmd, options) {
  return new Promise((resolve, reject) => {
    const { errCaptrue = false, log = true, ...rest } = options || {}
    if (log) preLog(cmd)
    let result = shelljs.exec(cmd, rest)
    if (errCaptrue) return resolve(result)
    if (result.code !== 0) {
      reject()
      shelljs.exit(1)
    } else {
      resolve(result.stdout)
    }
  })
}

async function prompt(message, options) {
  const { commit } = await inquirer.prompt([
    {
      type: 'input',
      message,
      name: 'commit',
      ...options,
    },
  ])
  return commit
}

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
  }
  const num = colors[color] || colors['default']
  return `\x1b[${num}m${str}\x1b[0m`
}

function checkPull(str, message) {
  return new Promise((resolve, reject) => {
    if (str.code === 0) return resolve()

    let info = str.stdout

    if (str.stdout.includes('CONFLICT')) {
      const errorMsg = `
        ${t('PUBLISH_FAIL_CONFLICT')}
        git add .
        git merge --continue
        git push
      `
      info = errorMsg
    }

    if (str.stdout.includes('unable to access')) {
      info = t('NETWORK_FAIL')
    }

    preLog(message || info, 'red')
    reject()
    shelljs.exit(1)
  })
}

async function checkBranchExist(branch) {
  return new Promise(async (resolve) => {
    const result = await exec(`git rev-parse --verify "origin/${branch}"`, {
      errCaptrue: true,
      silent: true,
<<<<<<< HEAD
      log: true,
    });
    if(result.code === 0) return resolve(true);
=======
      log: false,
    })
    if (result.code === 0) return resolve(true)
    resolve(false)
  })
}

async function checkHasUpstream(branch) {
  return new Promise(async (resolve) => {
<<<<<<< HEAD
    const result = await exec(
      `git rev-parse --abbrev-ref ${branch}@{upstream}`,
      {
        errCaptrue: true,
        silent: true,
        log: false,
      }
    );
    if (result.code === 0) return resolve(true);
>>>>>>> 938f443... feat(publish): 添加发布脚本
    resolve(false);
  });
=======
    const result = await exec(`git rev-parse --abbrev-ref ${branch}@{upstream}`, {
      errCaptrue: true,
      silent: true,
      log: false,
    })
    if (result.code === 0) return resolve(true)
    resolve(false)
  })
>>>>>>> 62e93d1... feat(locale): 添加多语言
}

function checkStatus() {
  return new Promise(async (resolve) => {
    let result = await exec('git status', { silent: true, log: false })
    if (result.includes(STATUS.COMMIT)) {
      resolve(STATUS.COMMIT)
    }
    if (result.includes(STATUS.PUSH)) {
      resolve(STATUS.PUSH)
    }
    if (result.includes(STATUS.UPDATED)) {
      resolve(STATUS.UPDATED)
    }
<<<<<<< HEAD
<<<<<<< HEAD
    resolve();
  })
}

module.exports = { log, preLog, checkPull, exec, prompt, checkBranchExist, checkStatus };
=======
    resolve(STATUS.NONE);
  });
=======
    resolve(STATUS.NONE)
  })
>>>>>>> 62e93d1... feat(locale): 添加多语言
}

module.exports = {
  log,
  preLog,
  checkPull,
  exec,
  prompt,
  checkBranchExist,
  checkStatus,
  checkHasUpstream,
  getExecTool,
<<<<<<< HEAD
};
>>>>>>> 938f443... feat(publish): 添加发布脚本
=======
}
>>>>>>> 62e93d1... feat(locale): 添加多语言
