import { exec, prompt, preLog, getConfig, getGmOptions, wrapHandle } from './utils';
import GitUtils from './utils/git';
import chalk from 'chalk';
import shelljs from 'shelljs';
import Push from './push';
import t from '@src/locale';

class Merge {
  /**
   * @name 合并分支
   * @param branch 当前分支
   * @param mergeBranch 要合并的分支
   * @description 
   *  1. 切换到当前分支
   *  2. 检查是否有上游
   *  3. 如果没有上游，设置上游
   *  4. 合并分支
   *  5. 推送
   * @returns 
   */
  private async mergeStart(branch: string, mergeBranch: string) {
    await exec(`git checkout ${branch}`);
    preLog(chalk.cyan(t('CUR_MERGE_BRANCH', { branch })));

    let hasUpstream = await GitUtils.checkHasUpstream(branch);

    if (!hasUpstream) {
      await exec(`git branch --set-upstream-to=origin/${branch} ${branch}`);
      return;
    }

    await GitUtils.pullLastCode();

    await this.mergeCode([mergeBranch]);
  }

  /**
   * @name 合并代码
   * @param mergeBranch 要合并的分支
   * @description 
   *  1. 合并代码
   *  2. 检查合并结果
   * @returns 
   */
  private async mergeCode(mergeBranch: string[]) {
    await mergeBranch.reduce(
      (promise: Promise<any>, branch: string) => promise.then(() => new Promise(async (resolve, reject) => {
        let mergeResult = await exec(`git merge origin/${branch}`, {
          errCaptrue: true,
        });
        await GitUtils.checkMerge(mergeResult);
        resolve(void 0);
      })),
      Promise.resolve()
    );

    await exec('git push');
  }

  /**
   * @name 合并前检查
   * @description 
   *  1. 检查是否有上游
   *  2. 检查是否有变化
   *  3. 检查是否需要推送
   *  4. 检查是否需要提交
   *  5. 推送
   * @returns 
   */
  private async mergeBefore() {
    const options = getGmOptions();
    let { needPush, isLastUpdate } = await GitUtils.gitStatus();

    if (!isLastUpdate) {
      if (!options.commit) {
        let submitResult = await prompt(t('CUR_BRANCH_HAS_CHANGE'), {
          type: 'confirm',
          initial: true,
        });
        if (!submitResult) shelljs.exit(1);
      }
      await Push.pushHandle();
    } else if (needPush) {
      if (!options.commit) {
        let submitResult = await prompt(t('CUR_BRANCH_START_PUSH'), {
          type: 'confirm',
          initial: true,
        });
        if (!submitResult) return;
      }
      await Push.pushStart();
    }
  }

  /**
   * @name 合并分支
   * @description 
   *  1. 获取配置
   *  2. 获取当前分支
   *  3. 获取要合并的分支
   *  4. 合并分支
   *  5. 切换回当前分支
   *  6. 打印合并成功
   * @returns 
   */
  private async mergeBranch() {
    let config = getConfig();
    const options = getGmOptions();
    const mergeConfig = config.merge || {};

    const branches = await GitUtils.getOriginBranches();
    const curBranch = await GitUtils.getCurrentBranch();

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
        type: 'multiselect',
        choices: choices.map((value) => ({ title: value, value })),
      });
    }

    await mergeBranches.reduce(
      (promise: Promise<any>, branch: string) => promise.then(() => this.mergeStart(branch, curBranch)),
      Promise.resolve()
    );

    await exec(`git checkout ${curBranch}`);

    await this.mergeAfter(mergeBranches, curBranch);

    preLog(chalk.green(t('MERGE_SUCCESS')));
  }

  /**
   * @name 合并后处理
   * @param mergeBranches 要合并的分支列表
   * @param curBranch 当前的分支
   * @description
   *  1. 判断合并的分支列表是否为1个
   *  2. 如果为1个，则本地分支直接merge 远程的这个分支
   *  3. 如果大于1个则提醒用户选择需要合并哪个远程的分支，可多选
   *  4. 合并完成后，打印合并成功
   * @returns 
   */
  private async mergeAfter(mergeBranches: string[], curBranch: string) {
    if (mergeBranches.length === 1) {
      await this.mergeCode(mergeBranches);
      return;
    }

    let mergeBranchs: string[] = await prompt(t('SELECT_MERGE_BRANCH'), {
      type: 'multiselect',
      choices: mergeBranches.map((value) => ({ title: value, value })),
    });

    await this.mergeCode(mergeBranchs);
  }

  public merge = () => {
    wrapHandle(async () => {
      await this.mergeBefore();
      await this.mergeBranch();
    }, 'merge');
  }
}

export default new Merge().merge;
