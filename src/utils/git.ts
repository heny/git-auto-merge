import { getGmOptions } from '@src/utils';
import t from '@src/locale';
import shelljs, { ExecOutputReturnValue } from 'shelljs';
import chalk from 'chalk';
import { exec, preLog } from './';
import simpleGit from 'simple-git';

class GitUtils {
  /**
   * 获取git状态
   * @returns 包含是否需要推送、是否是最新更新、是否有更改、当前分支、是否在跟踪的对象
   */
  public async gitStatus() {
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

  /**
   * 获取当前分支
   * @returns 当前分支名称
   */
  public async getCurrentBranch() {
    const curBranch = await exec('git rev-parse --abbrev-ref HEAD', {
      log: false,
    });
    return curBranch;
  }

  /**
   * 获取最新代码
   */
  public async pullLastCode() {
    const options = getGmOptions();
    const currentBranch = await this.getCurrentBranch();

    const fetchCommand = ['git', 'fetch', 'origin', currentBranch];
    if (!options.debug) fetchCommand.push('--quiet');

    await exec(fetchCommand);

    const resultCode = await exec('git rev-list --count --left-only @{u}...HEAD', {
      log: false,
    });
    if (+resultCode !== 0) {
      const mergeResult = await exec('git merge', { errCaptrue: true });
      await this.checkMerge(mergeResult);
    }
  }

  /**
   * @name 检查分支是否是最新
   * @param curBranch 当前分支
   * @param targetBranch 目标分支
   * @returns 是否是最新
   */
  public async checkIfUpToDate(curBranch: string, targetBranch: string): Promise<boolean> {
    try {
      const result = await exec(`git rev-list --count --left-right ${curBranch}...origin/${targetBranch}`, {
        log: false
      });
      const [ahead, behind] = result.trim().split('\t').map(Number);
      return ahead === 0 && behind === 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取远程分支
   * @returns 远程分支列表
   */
  public async getOriginBranches() {
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

  /**
   * 获取更改的文件
   * @returns 更改的文件列表
   */
  public async getChangeFiles() {
    const status = await exec('git status -s', { log: false });
    return status
      .split('\n')
      .map((v) => v.trim().split(' ').slice(-1)[0])
      .filter(Boolean);
  }

  /**
   * 检查合并结果
   * @param result 执行结果
   * @param message 错误信息
   * @returns Promise<void>
   */
  public checkMerge(result: ExecOutputReturnValue, message?: string): Promise<void> {
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

  /**
   * 检查分支是否存在
   * @param branch 分支名称
   * @returns 是否存在
   */
  public async checkBranchExist(branch: string): Promise<Boolean> {
    return new Promise(async (resolve) => {
      const result = await exec(`git rev-parse --verify "origin/${branch}"`, {
        errCaptrue: true,
        log: false,
      });
      if (result.code === 0) return resolve(true);
      resolve(false);
    });
  }

  /**
   * 检查是否有上游分支
   * @param branch 分支名称
   * @returns 是否有上游分支
   */
  public async checkHasUpstream(branch: string) {
    return new Promise(async (resolve) => {
      const result = await exec(`git rev-parse --abbrev-ref ${branch}@{upstream}`, {
        errCaptrue: true,
        log: false,
      });
      if (result.code === 0) return resolve(true);
      resolve(false);
    });
  }
}

export default new GitUtils();
