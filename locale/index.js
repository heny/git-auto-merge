const osLocale = require('os-locale');
const zhCN = require('./zh-CN');
const enUS = require('./en-US');

let locale = '';

let localeMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

module.exports = function (key, options = {}) {
  if (!locale) {
    locale = osLocale.sync();
  }

  let result = localeMap[locale] || localeMap['zh-CN'];

  return result(options)[key] || key;
};
