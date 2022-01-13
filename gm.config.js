const shelljs = require('shelljs');
module.exports = {
  merge: {
    branch: [],
    default: ['master'],
  },
  publish: {
    branch: 'master',
    tag: true,
    latest: true,
  },
  commitDefault: {
    type: 'feat',
    module: 'src',
    message: 'logic',
  },
  callback: function (command) {
    if (command === 'publish') {
      console.log('重新安装auto插件中...');
      shelljs.exec('npm -g i git-auto-merge');
    }
  },
};
