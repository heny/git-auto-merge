const Colors = {
  black: '30',
  red: '31',
  green: '32',
  yellow: '33',
  blue: '34',
  magenta: '35',
  cyan: '36',
  white: '37',
  default: '36',

  // Bright color
  blackBright: '90',
  redBright: '91',
  greenBright: '92',
  yellowBright: '93',
  blueBright: '94',
  magentaBright: '95',
  cyanBright: '96',
  whiteBright: '97',

  // Background color
  bgBlack: '40',
  bgRed: '41',
  bgGreen: '42',
  bgYellow: '43',
  bgBlue: '44',
  bgMagenta: '45',
  bgCyan: '46',
  bgWhite: '47',

  // Bright background color
  bgBlackBright: '100',
  bgRedBright: '101',
  bgGreenBright: '102',
  bgYellowBright: '103',
  bgBlueBright: '104',
  bgMagentaBright: '105',
  bgCyanBright: '106',
  bgWhiteBright: '107',
};

function log(str, color = 'default') {
  const num = Colors[color];
  return `\x1b[${num}m${str}\x1b[0m`;
}

console.log(log('hello', 'red'));
console.log(log('hello', 'redBright'));
console.log(log('hello', 'green'));
console.log(log('hello', 'greenBright'));
console.log(log('hello', 'yellow'));
console.log(log('hello', 'yellowBright'));
console.log(log('hello', 'blue'));
console.log(log('hello', 'blueBright'));
console.log(log('hello', 'magenta'));
console.log(log('hello', 'magentaBright'));
console.log(log('hello', 'cyan'));
console.log(log('hello', 'cyanBright'));
console.log(log('hello', 'white'));
console.log(log('hello', 'whiteBright'));
console.log(log('hello', 'bgBlack'));
console.log(log('hello', 'bgBlackBright'));
console.log(log('hello', 'bgRed'));
console.log(log('hello', 'bgRedBright'));
console.log(log('hello', 'bgGreen'));
console.log(log('hello', 'bgGreenBright'));
console.log(log('hello', 'bgYellow'));
console.log(log('hello', 'bgYellowBright'));
console.log(log('hello', 'bgBlue'));
console.log(log('hello', 'bgBlueBright'));
console.log(log('hello', 'bgMagenta'));
console.log(log('hello', 'bgMagentaBright'));
console.log(log('hello', 'bgCyan'));
console.log(log('hello', 'bgCyanBright'));
console.log(log('hello', 'bgWhite'));
console.log(log('hello', 'bgWhiteBright'));
