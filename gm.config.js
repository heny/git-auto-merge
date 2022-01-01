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
  callback: function () {
    console.log('部署成功');
  },
};
