module.exports = {
  merge: {
    branch: [],
    default: [],
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
    console.log('部署成功, 当前执行命令为：', command);
  },
};
