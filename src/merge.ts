import {
  exec,
  prompt,
  preLog,
  checkPull,
  checkStatus,
  checkHasUpstream,
  getExecTool,
  getConfig,
} from './utils';
import { STATUS } from './constant';
import { GmOptions, Config } from './interface';
import shelljs from 'shelljs';
import { pushStart, pushHandle } from './push';
import t from '../locale';

async function publish(branch: string, mergeBranch: string) {
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
  const options: GmOptions = JSON.parse(process.env.GM_OPTIONS || '{}');
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
  const options: GmOptions = JSON.parse(process.env.GM_OPTIONS || '{}');

  const collectBranch = await exec('git branch', { silent: true, log: false });
  const branches = collectBranch
    .split('\n')
    .filter(Boolean)
    .map((v: string) => v.trim());

  const curBranch =
    branches.find((branch: string) => branch.startsWith('*'))?.replace(/\s|\*/g, '') || '';

  let publishBranches = options.branch || [];

  if (!publishBranches.length) {
    const filterBranchs = branches.filter((branch: string) => !branch.includes(curBranch));

    const choices = config.mergeBranch?.length ? config.mergeBranch : filterBranchs;

    publishBranches = await prompt(t('SELECT_MERGE_BRANCH'), {
      type: 'checkbox',
      choices,
      default: config.mergeDefault || [],
    });
  }

  await publishBranches.reduce(
    (promise: Promise<any>, branch: string) => promise.then(() => publish(branch, curBranch)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);
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

  preLog(t('MERGE_SUCCESS'), 'green');

  let callback = config.callback || function () {};
  callback();

  if (isUseNpm) {
    const time = (Date.now() - startTime) / 1000;
    console.log('Done in %ss.', time.toFixed(2));
  }
}

export default _merge;
