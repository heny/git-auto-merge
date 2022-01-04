import inquirer from 'inquirer';

(async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Please select the type of change:',
      choices: [
        { name: 'hhhhh', value: 'h', description: 'hello' },
        { name: 'nnnnn', value: 'n' },
      ],
    },
  ]);
  console.log(answer, 'answer');
})();
