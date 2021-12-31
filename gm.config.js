module.exports = {
  merge: {
    branch: [],
    default: [],
  },
  publish: {
    branch: '',
    autoCreateTag: false,
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
