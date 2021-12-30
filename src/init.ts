import { writeFileSync } from 'fs';
import { PACKAGE_JSON_PATH } from './common/constant';
import { getPackageJson } from './utils';

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
        },
      },
      null,
      '  '
    )
  );
}

addScripts();
