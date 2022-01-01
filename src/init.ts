import { writeFileSync } from 'fs';
import { PACKAGE_JSON_PATH } from './common/constant';
import { getPackageJson, preLog } from './utils';
import t from '../locale';

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
  preLog(t('INIT_SUCCESS'));
}

addScripts();
