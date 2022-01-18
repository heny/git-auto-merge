import t from '@src/locale';
import { ReleaseType } from 'semver';
import path from 'path';

export const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');
export const GIT_AUTO_PACKAGE_NAME = 'git-auto-merge';

export enum STATUS {
  /** Need to add commit */
  COMMIT = 'commit',

  /** Direct push */
  PUSH = 'push',

  /** Content is the latest */
  UPDATED = 'update',

  /** Current branch distal does not exist */
  NONE = 'none',
}

export const STATUS_VAL = {
  // 修改和删除都是 Changes, 但是有新增的文件是 Untracked
  [STATUS.COMMIT]: ['Changes', 'Untracked'],
  [STATUS.PUSH]: 'to publish your local commits',
  [STATUS.UPDATED]: 'nothing to commit, working tree clean',
  [STATUS.NONE]: 'none',
};

export const COMMIT_OPTS = [
  { title: 'feat', description: t('CHANGE_TYPE_FEAT'), value: 'feat' },
  { title: 'fix', description: t('CHANGE_TYPE_FIX'), value: 'fix' },
  { title: 'docs', description: t('CHANGE_TYPE_DOCS'), value: 'docs' },
  { title: 'style', description: t('CHANGE_TYPE_STYLE'), value: 'style' },
  { title: 'refactor', description: t('CHANGE_TYPE_REFACTOR'), value: 'refactor' },
  { title: 'perf', description: t('CHANGE_TYPE_PERF'), value: 'perf' },
  { title: 'test', description: t('CHANGE_TYPE_TEST'), value: 'test' },
  { title: 'build', description: t('CHANGE_TYPE_BUILD'), value: 'build' },
  { title: 'ci', description: t('CHANGE_TYPE_CI'), value: 'ci' },
  { title: 'chore', description: t('CHANGE_TYPE_CHORE'), value: 'chore' },
  { title: 'revert', description: t('CHANGE_TYPE_REVERT'), value: 'revert' },
];

export const VERSION_TYPE: ReleaseType[] = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];
