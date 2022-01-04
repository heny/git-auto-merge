const shelljs = require('shelljs');
module.exports = {
  merge: {
    branch: [],
    default: ['master'],
  },
  publish: {
    branch: 'master',
    autoCreateTag: true,
    latest: true,
  },
  commitDefault: {
    type: 'feat',
    module: 'src',
    message: 'logic',
  },
  callback: function (command) {
    if (command === 'publish') {
      shelljs.exec('npm -g i git-auto-merge');
    }
  },
};
