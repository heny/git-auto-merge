import t from '@src/locale';
import shelljs, { ExecOutputReturnValue } from 'shelljs';
import chalk from 'chalk';
import { STATUS, STATUS_VAL } from '@src/common/constant';
import { exec, preLog } from './';

export async function getCurrentBranch() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
  });
  return curBranch;
}

export async function localIsLatest() {
  let resultCode = await exec('git rev-list --count --left-only @{u}...HEAD', { log: false });
  return resultCode === '0';
}

export async function getOriginBranches() {
  let branches = await exec('git branch -r', {
    log: false,
  });
  let branchesBefore = branches
    .split('\n')
    .map((v) => v.replace('origin/', '').trim())
    .filter(Boolean);

  if (branchesBefore[0]?.includes('HEAD')) {
    branchesBefore = branchesBefore.slice(1);
  }
  return branchesBefore;
}

export async function getChangeFiles() {
  const status = await exec('git status -s', { log: false });
  return status
    .split('\n')
    .map((v) => v.trim().split(' ').slice(-1)[0])
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

    preLog(chalk.redBright(message || info));
    reject();
    shelljs.exit(1);
  });
}

export async function checkBranchExist(branch: string): Promise<Boolean> {
  return new Promise(async (resolve) => {
    const result = await exec(`git rev-parse --verify "origin/${branch}"`, {
      errCaptrue: true,
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
      log: false,
    });
    if (result.code === 0) return resolve(true);
    resolve(false);
  });
}

export function checkStatus(): Promise<STATUS> {
  return new Promise(async (resolve) => {
    let result: string = await exec('git status', { log: false });
    // 注意顺序
    if (STATUS_VAL[STATUS.COMMIT].some((v) => result.includes(v))) {
      resolve(STATUS.COMMIT);
    }
    if (result.includes(STATUS_VAL[STATUS.PUSH])) {
      resolve(STATUS.PUSH);
    }
    if (result.includes(STATUS_VAL[STATUS.UPDATED])) {
      resolve(STATUS.UPDATED);
    }
    resolve(STATUS.NONE);
  });
}
