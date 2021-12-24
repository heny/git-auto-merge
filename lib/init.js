<<<<<<< HEAD
const fs = require("fs")
=======
const fs = require('fs');
>>>>>>> 2c61d25 (feat(index): 增加默认配置项)

function addPostinstall(packageJsonPath) {
  const json = JSON.parse(fs.readFileSync(packageJsonPath))
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        ...json,
        scripts: {
          ...json.scripts,
<<<<<<< HEAD
          'gm': "git-auto-merge",
          'gp': 'git-auto-push',
        },
      },
      null,
      "  ",
    ),
  )
}
addPostinstall(process.cwd() + '/package.json');
=======
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
>>>>>>> 2c61d25 (feat(index): 增加默认配置项)
