import inquirer from 'inquirer';
import shelljs, { ExecOutputReturnValue, ShellString } from 'shelljs';
import dayjs from 'dayjs';
import { STATUS, Colors } from './constant';
import { Config } from './interface';
import { ColorKey, ExecOptions } from './interface';
import t from '../locale';

let config: Partial<Config> = {};
try {
  config = require(process.cwd() + '/gm.config.js');
} catch {}

export function log(str: string, color: ColorKey = 'default') {
  const num = Colors[color];
  return `\x1b[${num}m${str}\x1b[0m`;
}

export function preLog(str: string, color: ColorKey = 'green') {
  const logPrefix = config.logPrefix || `[${log('web')}/${log(dayjs().format('HH:mm:ss'))}]:`;
  console.log(logPrefix, log(str, color));
}

export function getExecTool() {
  const path: string = process.env.npm_execpath || '';
  if (path.includes('yarn')) return 'yarn';
  return 'npm';
}

export function exec(cmd: string, options: ExecOptions = {}): Promise<ShellString> {
  return new Promise((resolve, reject) => {
    const { errCaptrue = false, log = true, ...rest } = options;
    if (log) preLog(cmd);
    let result = shelljs.exec(cmd, rest);
    if (errCaptrue) return resolve(result);
    if (result.code !== 0) {
      reject();
      shelljs.exit(1);
    } else {
      resolve(result.stdout as ShellString);
    }
  });
}

export async function prompt(
  message: string,
  options: inquirer.Question & {
    choices?: any[];
  } = {}
) {
  const { commit } = await inquirer.prompt([
    {
      type: 'input',
      message,
      name: 'commit',
      ...options,
    },
  ]);
  return commit;
}

export function checkPull(result: ExecOutputReturnValue, message?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (result.code === 0) return resolve();

    let info = result.stdout;

    if (result.stdout.includes('CONFLICT')) {
      const errorMsg = `
        ${t('PUBLISH_FAIL_CONFLICT')}
        git add .
        git merge --continue
        git push
      `;
      info = errorMsg;
    }

    if (result.stdout.includes('unable to access')) {
      info = t('NETWORK_FAIL');
    }

    preLog(message || info, 'red');
    reject();
    shelljs.exit(1);
  });
}

export async function checkBranchExist(branch: string): Promise<Boolean> {
  return new Promise(async (resolve) => {
    const result = await exec(`git rev-parse --verify "origin/${branch}"`, {
      errCaptrue: true,
      silent: true,
      log: false,
    });
    if (result.code === 0) return resolve(true);
    resolve(false);
  });
}

export async function checkHasUpstream(branch: string) {
  return new Promise(async (resolve) => {
    const result = await exec(`git rev-parse --abbrev-ref ${branch}@{upstream}`, {
      errCaptrue: true,
      silent: true,
      log: false,
    });
    if (result.code === 0) return resolve(true);
    resolve(false);
  });
}

export function checkStatus(): Promise<STATUS> {
  return new Promise(async (resolve) => {
    let result: string = await exec('git status', { silent: true, log: false });
    if (result.includes(STATUS.COMMIT)) {
      resolve(STATUS.COMMIT);
    }
    if (result.includes(STATUS.PUSH)) {
      resolve(STATUS.PUSH);
    }
    if (result.includes(STATUS.UPDATED)) {
      resolve(STATUS.UPDATED);
    }
    resolve(STATUS.NONE);
  });
}