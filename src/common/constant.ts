import t from '../../locale';
import path from 'path';

export const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');

export enum STATUS {
  /** Need to add commit */
  COMMIT = 'git add',

  /** Direct push */
  PUSH = 'to publish your local commits',

  /** Content is the latest */
  UPDATED = 'nothing to commit, working tree clean',

  /** Current branch distal does not exist */
  NONE = 'none',
}

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

export enum Colors {
  black = '30',
  red = '31',
  green = '32',
  yellow = '33',
  blue = '34',
  magenta = '35',
  cyan = '36',
  white = '37',
  default = '36',

  // Bright color
  blackBright = '90',
  redBright = '91',
  greenBright = '92',
  yellowBright = '93',
  blueBright = '94',
  magentaBright = '95',
  cyanBright = '96',
  whiteBright = '97',

  // Background color
  bgBlack = '40',
  bgRed = '41',
  bgGreen = '42',
  bgYellow = '43',
  bgBlue = '44',
  bgMagenta = '45',
  bgCyan = '46',
  bgWhite = '47',

  // Bright background color
  bgBlackBright = '100',
  bgRedBright = '101',
  bgGreenBright = '102',
  bgYellowBright = '103',
  bgBlueBright = '104',
  bgMagentaBright = '105',
  bgCyanBright = '106',
  bgWhiteBright = '107',
}
