import { exec, prompt, preLog, getExecTool, getConfig, getGmOptions } from './utils';
import {
  checkPull,
  checkStatus,
  checkHasUpstream,
  getOriginBranches,
  getCurrentBranch,
} from './utils/git';
import { STATUS } from './common/constant';
import { Config } from './common/interface';
import shelljs from 'shelljs';
import { pushStart, pushHandle } from './push';
import t from '../locale';

async function mergeStart(branch: string, mergeBranch: string) {
  preLog(t('CUR_MERGE_BRANCH', { branch }));
  await exec(`git checkout ${branch}`);

  let hasUpstream = await checkHasUpstream(branch);

  if (!hasUpstream) {
    await exec(`git branch --set-upstream-to=origin/${branch} ${branch}`);
    return;
  }

  const pullResult = await exec('git pull', { errCaptrue: true });
  await checkPull(pullResult);

  let mergeResult = await exec(`git merge origin/${mergeBranch}`, {
    errCaptrue: true,
  });
  await checkPull(mergeResult);

  await exec('git push');
}

async function mergeBefore() {
  const options = getGmOptions();
  let statusResult = await checkStatus();

  if (statusResult === STATUS.COMMIT) {
    if (!options.commit) {
      let submitResult = await prompt(t('CUR_BRANCH_HAS_CHANGE'), {
        type: 'confirm',
      });
      if (!submitResult) shelljs.exit(1);
    }
    await pushHandle({ isMerge: true });
  }

  if (statusResult === STATUS.PUSH || statusResult === STATUS.NONE) {
    if (!options.commit) {
      let submitResult = await prompt(t('CUR_BRANCH_START_PUSH'), {
        type: 'confirm',
      });
      if (!submitResult) return;
    }
    await pushStart();
  }
}

async function mergeBranch(config: Config) {
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
    const filterBranchs = branches.filter((branch: string) => branch !== curBranch);

    const choices = mergeConfig.branch?.length ? mergeConfig.branch : filterBranchs;

    mergeBranches = await prompt(t('SELECT_MERGE_BRANCH'), {
      type: 'checkbox',
      choices,
    });
  }

  await mergeBranches.reduce(
    (promise: Promise<any>, branch: string) => promise.then(() => mergeStart(branch, curBranch)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);

  preLog(t('MERGE_SUCCESS'), 'green');
}

async function _merge() {
  const isUseNpm = getExecTool() === 'npm';
  let startTime = 0;
  if (isUseNpm) startTime = Date.now();

  if (!shelljs.which('git')) {
    shelljs.echo('Sorry, this script requires git');
    shelljs.exit(1);
  }

  let config = getConfig();

  await mergeBefore();

  await mergeBranch(config);

  let callback = config.callback || function () {};
  callback();

  if (isUseNpm) {
    const time = (Date.now() - startTime) / 1000;
    console.log('Done in %ss.', time.toFixed(2));
  }
}

export default _merge;
