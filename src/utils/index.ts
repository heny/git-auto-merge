import prompts from 'prompts';
import shelljs, { ShellString } from 'shelljs';
import dayjs from 'dayjs';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { PACKAGE_JSON_PATH } from '@src/common/constant';
import { Config, Types } from '@src/common/interface';
import { ExecOptions, GmOptions, CommandName } from '@src/common/interface';
import path from 'path';
import { readFileSync } from 'fs';
import debugs from 'debug';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const originExec = promisify(execCallback);

export async function isCommandAvailable(command: string) {
  try {
    await originExec(command);
    return true;
  } catch (error) {
    return false;
  }
}

const debug = debugs('exec');

/**
 * warn: wrapHandle must await, Nested functions with one less await will no longer wait
 */
export async function wrapHandle(func: () => Promise<any>, command: CommandName): Promise<any> {
  const options = getGmOptions();
  const isCurrentCommand = options.commandName === command;
  const isMeasureTime = isCurrentCommand && getExecTool() === 'npm';
  let startTime = 0;
  if (isMeasureTime) startTime = Date.now();

  await func();

  if (isMeasureTime) {
    const time = (Date.now() - startTime) / 1000;
    console.log('Done in %ss.', time.toFixed(2));
  }

  if (isCurrentCommand) getConfig().callback?.(command);
}

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

// 获取当前项目的最新版本
export async function getLatestVersion(packageName?: string) {
  packageName = packageName || getPackageJson().name;
  const originInfo = await exec(
    `npm view ${packageName} --registry https://registry.npmjs.org/ --json`,
    { log: false, errCaptrue: true }
  );
  if (originInfo.code !== 0) return '0.0.0';
  const info = JSON.parse(originInfo.stdout);
  return info['dist-tags'].latest;
}

export function types(key: any): Types {
  return Object.prototype.toString.call(key).slice(8, -1) as Types;
}

export function getPrintPre() {
  const config = getConfig();
  const logPrefix =
    config.logPrefix ||
    `[${chalk.blueBright('web')}/${chalk.blueBright(dayjs().format('HH:mm:ss'))}]:`;
  return logPrefix;
}

export function printInline(message: string) {
  message = getPrintPre() + ' ' + message
  process.stdout.write(`\r${(message)}`);
}

export function preLog(str: string) {
  process.stdout.write('\r');
  const log = getPrintPre()
  console.log(log, str);
}

export function getExecTool() {
  const path: string = process.env.npm_execpath || '';
  if (path.includes('yarn')) return 'yarn';
  return 'npm';
}

export function exec(cmd: string | string[], options: ExecOptions = {}): Promise<ShellString> {
  const { errCaptrue = false, log = true, ...rest } = options;
  cmd = Array.isArray(cmd) ? cmd.join(' ') : cmd;
  const { debug: detailOutput } = getGmOptions();

  if (detailOutput || log) {
    preLog(chalk.cyan(cmd));
  }
  if (!detailOutput && !log) {
    Object.assign(rest, { silent: true });
  }

  debug(cmd);

  return new Promise((resolve, reject) => {
    let result = shelljs.exec(cmd as string, rest);
    if (errCaptrue) return resolve(result);
    if (result.code !== 0) {
      reject();
      shelljs.exit(1);
    } else {
      resolve(result.stdout.trim() as ShellString);
    }
  });
}

export async function prompt(message: string, options?: Partial<prompts.PromptObject>) {
  const { commit } = await prompts(
    {
      type: 'text',
      name: 'commit',
      message,
      ...options,
    },
    { onCancel: () => process.exit(0) }
  );
  return commit;
}
