const chalk = require('chalk');
console.log(
  `${chalk.hex('#999')('[')}${chalk.blueBright('web')}${chalk.hex('#999')('/')}${chalk.blueBright(
    '12:11:59'
  )}${chalk.hex('#999')(']:')} `,
  chalk.cyan('hello world'),
  chalk.green('hello'),
  chalk.greenBright('world')
);
