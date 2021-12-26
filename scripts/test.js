const { getConfig } = require('../dist/src/utils');

(async function () {
  let config = await getConfig();
  console.log(config, 'config');
})();
