import inquirer from 'inquirer';
import shelljs, { ShellString } from 'shelljs';
import dayjs from 'dayjs';
import { existsSync } from 'fs';
import { Colors, PACKAGE_JSON_PATH } from '../common/constant';
import { Config, Types } from '../common/interface';
import { ColorKey, ExecOptions, GmOptions } from '../common/interface';
import path from 'path';
import { readFileSync } from 'fs';

export function getConfig(): Config {
  const configPath = path.resolve(process.cwd(), 'gm.config.js');
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

export function getGmOptions(): GmOptions {
  try {
    return JSON.parse(process.env.GM_OPTIONS || '{}');
  } catch {
    return {};
  }
}

export function getPackageJson() {
  try {
    return JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  } catch {
    return {};
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