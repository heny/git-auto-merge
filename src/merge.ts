import {
  exec,
  prompt,
  preLog,
  getConfig,
  getGmOptions,
  wrapHandle,
} from './utils';
import {
  checkPull,
  checkHasUpstream,
  getOriginBranches,
  getCurrentBranch,
  localIsLatest,
  gitStatus,
} from './utils/git';
import chalk from 'chalk';
import shelljs from 'shelljs';
import { pushStart, pushHandle } from './push';
import t from '@src/locale';

async function mergeStart(branch: string, mergeBranch: string) {
  preLog(chalk.cyan(t('CUR_MERGE_BRANCH', { branch })));
  await exec(`git checkout ${branch}`);

  let hasUpstream = await checkHasUpstream(branch);

  if (!hasUpstream) {
    await exec(`git branch --set-upstream-to=origin/${branch} ${branch}`);
    return;
  }

  let isLatest = await localIsLatest();
  if (!isLatest) {
    const pullResult = await exec('git pull', { errCaptrue: true });
    await checkPull(pullResult);
  }

  let mergeResult = await exec(`git merge origin/${mergeBranch}`, {
    errCaptrue: true,
  });
  await checkPull(mergeResult);

  await exec('git push');
}

async function mergeBefore() {
  const options = getGmOptions();
  let { needPush, isLastUpdate } = await gitStatus();

  if (!isLastUpdate) {
    if (!options.commit) {
      let submitResult = await prompt(t('CUR_BRANCH_HAS_CHANGE'), {
        type: 'confirm',
        initial: true,
      });
      if (!submitResult) shelljs.exit(1);
    }
    await pushHandle();
  }

  if (needPush) {
    if (!options.commit) {
      let submitResult = await prompt(t('CUR_BRANCH_START_PUSH'), {
        type: 'confirm',
        initial: true,
      });
      if (!submitResult) return;
    }
    await pushStart();
  }
}

async function mergeBranch() {
  let config = getConfig();
  const options = getGmOptions();
  const mergeConfig = config.merge || {};

  const branches = await getOriginBranches();
  const curBranch = await getCurrentBranch();

  if (branches.length === 1) return Promise.resolve();

  let mergeBranches =
    options.branch ||
    (process.env.PUBLISH_BRANCH && [process.env.PUBLISH_BRANCH]) ||
    mergeConfig.default ||
    [];

  if (!mergeBranches.length) {
    const filterBranchs = branches.filter(
      (branch: string) => branch !== curBranch
    );

    const choices = mergeConfig.branch?.length
      ? mergeConfig.branch
      : filterBranchs;

    mergeBranches = await prompt(t('SELECT_MERGE_BRANCH'), {
      type: 'multiselect',
      choices: choices.map((value) => ({ title: value, value })),
    });
  }

  await mergeBranches.reduce(
    (promise: Promise<any>, branch: string) =>
      promise.then(() => mergeStart(branch, curBranch)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);

  preLog(chalk.green(t('MERGE_SUCCESS')));
}

async function _merge() {
  await wrapHandle(async function () {
    await mergeBefore();

    await mergeBranch();
  }, 'merge');
}

export default _merge;
