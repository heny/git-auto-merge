import { COMMIT_OPTS } from '../src/common/constant';
import { prompt } from '../src/utils';

(async () => {
  let commit = await prompt('请选择提交类型', {
    type: 'autocomplete',
    name: 'commit',
    choices: COMMIT_OPTS,
  });
  let demo = await prompt('请输入commit信息');
  console.log(commit, demo);
})();
