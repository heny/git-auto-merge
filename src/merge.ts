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
import shelljs from 'shelljs';
import { pushStart, pushHandle } from './push';
import t from '../locale';

async function publish(branch: string, mergeBranch: string) {
  preLog(t('CUR_PUBLISH_BRANCH', { branch }));
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
  let statusResult = await checkStatus();

  if (statusResult === STATUS.COMMIT) {
    let submitResult = await prompt(t('CUR_BRANCH_HAS_CHANGE'), {
      type: 'confirm',
    });
    if (!submitResult) shelljs.exit(1);
    await pushHandle(true);
  }

  if (statusResult === STATUS.PUSH || statusResult === STATUS.NONE) {
    let submitResult = await prompt(t('CUR_BRANCH_START_PUSH'), {
      type: 'confirm',
    });
    if (submitResult) await pushStart();
  }
}

async function _merge(callback = () => {}) {
  if (getExecTool() === 'npm') console.time('Done');
  if (!shelljs.which('git')) {
    shelljs.echo('Sorry, this script requires git');
    shelljs.exit(1);
  }

  let config = await getConfig();

  const collectBranch = await exec('git branch', { silent: true, log: false });
  const branches = collectBranch
    .split('\n')
    .filter(Boolean)
    .map((v: string) => v.trim());

  const curBranch =
    branches.find((branch: string) => branch.startsWith('*'))?.replace(/\s|\*/g, '') || '';

  await mergeBefore();

  const filterBranchs = branches.filter((branch: string) => !branch.includes(curBranch));
  const choices = config.mergeBranch?.length ? config.mergeBranch : filterBranchs;

  const publishBranches = await prompt(t('SELECT_PUBLISH_BRANCH'), {
    type: 'checkbox',
    choices,
    default: config.mergeDefault || [],
  });

  await publishBranches.reduce(
    (promise: Promise<any>, branch: string) => promise.then(() => publish(branch, curBranch)),
    Promise.resolve()
  );

  await exec(`git checkout ${curBranch}`);
  preLog(t('PUBLISH_SUCCESS'), 'green');

  callback = callback || config.callback || function () {};
  callback();
  if (getExecTool() === 'npm') console.timeEnd('Done');
}

export default _merge;
