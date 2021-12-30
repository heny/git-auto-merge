const { exec } = require('../dist/src/utils');
(async () => {
  let loginStatus = await exec('npm whoami', { log: false, silent: true, errCaptrue: true });
  console.log(loginStatus, 'loginStatus');
})();
