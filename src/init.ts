import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function addScripts() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const json = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  writeFileSync(
    packageJsonPath,
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
