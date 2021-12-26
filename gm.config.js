module.exports = {
  mergeBranch: [],
  mergeDefault: [],
  callback: function () {
    console.log('部署成功');
  },
  commitDefault: {
    type: 'feat',
    module: 'index',
    message: 'logic',
  },
};
