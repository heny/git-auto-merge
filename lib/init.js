const fs = require("fs")

function addPostinstall(packageJsonPath) {
  const json = JSON.parse(fs.readFileSync(packageJsonPath))
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        ...json,
        scripts: {
          ...json.scripts,
          'gm': "npm run git-auto-merge",
          'gp': 'npm run git-auto-push',
        },
      },
      null,
      "  ",
    ),
  )
}
addPostinstall(process.cwd() + '/package.json');
