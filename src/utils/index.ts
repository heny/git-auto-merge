import inquirer from 'inquirer';
import shelljs, { ExecOutputReturnValue, ShellString } from 'shelljs';
import dayjs from 'dayjs';
import { existsSync } from 'fs';
import { STATUS, Colors } from '../common/constant';
import { Config, Types } from '../common/interface';
import { ColorKey, ExecOptions } from '../common/interface';
import t from '../../locale';

export function getConfig(): Config {
  const configPath = process.cwd() + '/gm.config.js';
  if (!existsSync(configPath)) return {} as Config;

  try {
    // No import is used here, and logging should not use asynchronous
    const config = require(configPath);
    const isObj = types(config) === 'Object';
    return isObj ? config : ({} as Config);
  } catch {
    return {} as Config;
  }
}

export function types(key: any): Types {
  return Object.prototype.toString.call(key).slice(8, -1) as Types;
}

export function log(str: string, color: ColorKey = 'default') {
  const num = Colors[color];
  return `\x1b[${num}m${str}\x1b[0m`;
}

export async function preLog(str: string, color: ColorKey = 'green') {
  const config = getConfig();
  const logPrefix = config.logPrefix || `[${log('web')}/${log(dayjs().format('HH:mm:ss'))}]:`;
  console.log(logPrefix, log(str, color));
}

export function getExecTool() {
  const path: string = process.env.npm_execpath || '';
  if (path.includes('yarn')) return 'yarn';
  return 'npm';
}

export function exec(cmd: string, options: ExecOptions = {}): Promise<ShellString> {
  const { errCaptrue = false, log = true, ...rest } = options;
  if (log) preLog(cmd);
  return new Promise((resolve, reject) => {
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

export async function getCurrentBranch() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
    silent: true,
  });
  return curBranch;
}

export async function getOriginBranches() {
  const branches = await exec('git branch -r', {
    log: false,
    silent: true,
  });
  return branches
    .split('\n')
    .slice(1)
    .map((v) => v.replace('origin/', '').trim())
    .filter(Boolean);
}

export function checkPull(result: ExecOutputReturnValue, message?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (result.code === 0) return resolve();

    let info = result.stdout;

    if (result.stdout.includes('CONFLICT')) {
      const errorMsg = `
        ${t('MERGE_FAIL_CONFLICT')}
        git add .
        git merge --continue
        git push
      `;
      info = errorMsg;
    }

    if (result.stdout.includes('unable to access')) {
      info = t('NETWORK_FAIL');
    }

    preLog(message || info, 'redBright');
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
