import { readFileSync, writeFileSync } from 'fs';

function addScripts(packageJsonPath: string) {
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

addScripts(process.cwd() + '/package.json');
