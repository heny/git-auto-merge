const shelljs = require('shelljs');
const { exec } = require('../dist/src/utils');

(async () => {
  let res = await exec('git branch -r', {
    log: false,
    silent: true,
  });
  console.log(
    res
      .split('\n')
      .slice(1)
      .map((v) => v.replace('origin/', '').trim())
      .filter(Boolean),
    'res'
  );
})();
