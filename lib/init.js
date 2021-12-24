const fs = require('fs');

function addScripts(packageJsonPath) {
  const json = JSON.parse(fs.readFileSync(packageJsonPath));
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        ...json,
        scripts: {
          ...json.scripts,
          gm: 'git-auto-merge',
          gp: 'git-auto-push',
        },
      },
      null,
      '  '
    )
  );
}
addScripts(process.cwd() + '/package.json');
