import {
  exec,
  prompt,
  preLog,
  getConfig,
  getGmOptions,
  wrapHandle,
} from '@src/utils';
import {
  checkPull,
  checkBranchExist,
  checkHasUpstream,
  getCurrentBranch,
  getChangeFiles,
  localIsLatest,
  gitStatus,
} from '@src/utils/git';
import chalk from 'chalk';
import { COMMIT_OPTS } from '@src/common/constant';
import t from '@src/locale';
import shelljs from 'shelljs';

export async function pushStart() {
  // preLog(chalk.cyan(t('PUSH_BRANCH_CHECK')));
  const options = getGmOptions();
  const curBranch = await getCurrentBranch();
  let checkFlag = await checkBranchExist(curBranch);

  if (!checkFlag) {
    if (!options.force) {
      let isCreateBranch = await prompt(t('CUR_BRANCH_NOT_EXIST'), {
        type: 'confirm',
        initial: true,
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

  let isLatest = await localIsLatest();
  if (!isLatest) {
    const pullResult = await exec('git pull', { errCaptrue: true });
    await checkPull(pullResult);
  }

  await exec('git push');
}

async function addCommit() {
  const options = getGmOptions();
  if (!options.commit) {
    const config = getConfig();
    const commitDefault = config.commitDefault;

    const type = await prompt(t('SELECT_CHANGE_TYPE'), {
      type: 'autocomplete',
      choices: COMMIT_OPTS,
      initial: commitDefault?.type || 'feat',
    });

    const module = await prompt(t('INPUT_CHANGE_MODULE'), {
      initial: commitDefault?.module || '',
      format: (value) => {
        return value ? `(${value})` : '';
      },
    });

    const message = await prompt(t('INPUT_CHANGE_MESSAGE'), {
      initial: commitDefault?.message || 'logic',
    });

    await exec(`git commit -m "${type}${module}: ${message}"`);
  } else {
    await exec(`git commit -m "${options.commit}"`);
  }
}

async function getPartFiles() {
  let files = await getChangeFiles();
  return prompt(t('PUSH_SELECT_PART_FILE'), {
    type: 'multiselect',
    choices: files.map((value) => ({ title: value, value })),
  });
}

export async function pushHandle() {
  await wrapHandle(async function () {
    let { needPush, isLastUpdate, hasChange } = await gitStatus();

    if (isLastUpdate) {
      preLog(chalk(t('CONTENT_IS_UPTODATE')));
      return Promise.resolve();
    }

    if (!hasChange && needPush) return pushStart();

    let addFiles = ['.'];

    if (getGmOptions().part) {
      addFiles = await getPartFiles();
    }

    await exec(`git add ${addFiles.join(' ')}`);

    await addCommit();

    await pushStart();
  }, 'push');
}
