import t from '@src/locale';
import shelljs, { ExecOutputReturnValue } from 'shelljs';
import chalk from 'chalk';
import { exec, preLog } from './';
import simpleGit from 'simple-git';

export async function gitStatus() {
  const statusRes = await simpleGit().status();
  const needPush = !!statusRes.ahead;
  const hasChange = !!statusRes.files.length;
  const isLastUpdate = !statusRes.files.length && !needPush;
  return {
    needPush,
    isLastUpdate,
    hasChange,
    currentBranch: statusRes.current,
    isTracking: statusRes.tracking,
  };
}

export async function getCurrentBranch() {
  const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
    log: false,
  });
  return curBranch;
}

export async function localIsLatest() {
  await exec('git fetch', { log: false });
  let resultCode = await exec('git rev-list --count --left-only @{u}...HEAD', {
    log: false,
  });
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
