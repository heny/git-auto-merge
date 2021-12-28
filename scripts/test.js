const shelljs = require('shelljs');

(async () => {
  let res = await shelljs.exec('git status -s');
  console.log(res.stdout, 'res');
})();
