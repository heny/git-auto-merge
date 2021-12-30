import t from '../../locale';
import shelljs, { ExecOutputReturnValue } from 'shelljs';
import { STATUS } from '../common/constant';
import { exec, preLog } from './';

export async function getCurrentBranch() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
    silent: true,
  });
  return curBranch.trim();
}

export async function getOriginBranches() {
  let branches = await exec('git branch -r', {
    log: false,
    silent: true,
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
