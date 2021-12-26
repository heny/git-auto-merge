const { getConfig } = require('../dist/lib/utils');

(async function () {
  let config = await getConfig();
  console.log(config, 'config');
})();
