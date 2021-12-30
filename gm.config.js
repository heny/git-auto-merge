module.exports = {
  mergeBranch: [],
  mergeDefault: ['master'],
  callback: function () {
    console.log('部署成功');
  },
  publishBranch: 'master',
  commitDefault: {
    type: 'feat',
    module: 'src',
    message: 'logic',
  },
};
