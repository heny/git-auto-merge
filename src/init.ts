import { writeFileSync } from 'fs';
import { PACKAGE_JSON_PATH } from './common/constant';
import { getPackageJson, preLog } from './utils';
import chalk from 'chalk';
import t from '@src/locale';

function addScripts() {
  const json = getPackageJson();
  writeFileSync(
    PACKAGE_JSON_PATH,
    JSON.stringify(
      {
        ...json,
        scripts: {
          ...json.scripts,
          gm: 'git-auto merge',
          gp: 'git-auto push',
          gpb: 'git-auto publish',
        },
      },
      null,
      '  '
    )
  );
  preLog(chalk.cyan(t('INIT_SUCCESS')));
}

addScripts();
