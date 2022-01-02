import { exec, prompt, preLog, getConfig, getGmOptions, wrapHandle } from './utils';
import {
  checkPull,
  checkBranchExist,
  checkStatus,
  checkHasUpstream,
  getCurrentBranch,
} from './utils/git';
import { STATUS, COMMIT_OPTS } from './common/constant';
import t from '../locale';
import shelljs from 'shelljs';

export async function pushStart() {
  const options = getGmOptions();
  const curBranch = await getCurrentBranch();
  let checkFlag = await checkBranchExist(curBranch);

  if (!checkFlag) {
    if (!options.force) {
      let isCreateBranch = await prompt(t('CUR_BRANCH_NOT_EXIST'), {
        type: 'confirm',
      });
      if (!isCreateBranch) shelljs.exit(1);
    }
    await exec(`git push --set-upstream origin ${curBranch}`);
    return Promise.resolve();
  }

  let hasUpstream = await checkHasUpstream(curBranch);

  if (!hasUpstream) {
    await exec(`git push --set-upstream origin ${curBranch}`);
    return;
  }

  const pullResult = await exec('git pull', { errCaptrue: true });
  await checkPull(pullResult);

  await exec('git push');
}

async function addCommit() {
  const options = getGmOptions();
  if (!options.commit) {
    const config = getConfig();
    const commitDefault = config.commitDefault;

    const type = await prompt(t('SELECT_CHANGE_TYPE'), {
      type: 'list',
      choices: COMMIT_OPTS,
      default: commitDefault?.type || 'feat',
    });

    const module = await prompt(t('INPUT_CHANGE_MODULE'), {
      default: commitDefault?.module || 'src',
    });
    const message = await prompt(t('INPUT_CHANGE_MESSAGE'), {
      default: commitDefault?.message || 'logic',
    });
    await exec(`git commit -m "${type}(${module}): ${message}"`);
  } else {
    await exec(`git commit -m "${options.commit}"`);
  }
}

export async function pushHandle() {
  // const options = getGmOptions();
  // const isCurrentCommand = options.commandName === 'push';
  // const isMeasureTime = isCurrentCommand && getExecTool() === 'npm';
  // let startTime = 0;
  // if (isMeasureTime) startTime = Date.now();

  wrapHandle(async function () {
    let statusResult = await checkStatus();

    if (statusResult === STATUS.UPDATED) {
      preLog(t('CONTENT_IS_UPTODATE'));
      return Promise.resolve();
    }

    if (statusResult === STATUS.PUSH || statusResult === STATUS.NONE) {
      return pushStart();
    }

    await exec('git add .');

    await addCommit();

    await pushStart();
  }, 'push');

  // if (isCurrentCommand) getConfig().callback?.();

  // if (isMeasureTime) {
  //   const time = (Date.now() - startTime) / 1000;
  //   console.log('Done in %ss.', time.toFixed(2));
  // }
}
