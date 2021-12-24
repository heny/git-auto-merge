module.exports = {
  mergeBranch: [],
  mergeDefault: [],
  callback: function () {
    console.log('部署完成')
  },
  commitDefault: {
    type: 'feat',
    module: 'index',
    message: 'logic',
  },
}
