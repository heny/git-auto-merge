import osLocale from 'os-locale';
import zhCN from './zh-CN';
import enUS from './en-US';

let localeMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

type Locale = keyof typeof localeMap;

let locale: Locale;

type ZhCN = keyof ReturnType<typeof zhCN>;
type EnUS = keyof ReturnType<typeof enUS>;

export default function (key: ZhCN & EnUS, options = {}) {
  if (!locale) {
    locale = (osLocale.sync() as Locale) || 'zh-CN';
  }

  let result = localeMap[locale];

  return result(options)[key] || key;
}
