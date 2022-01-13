const chalk = require('chalk');
console.log(
  `${chalk.white('[')}${chalk.blueBright('web')}${chalk.white('/')}${chalk.blueBright(
    '12:11:59'
  )}${chalk.white(']:')} `,
  chalk.cyan('hello world'),
  chalk.green('hello'),
  chalk.greenBright('world')
);
