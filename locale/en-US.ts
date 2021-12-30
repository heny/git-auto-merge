import { Options } from './';
export default function (config: Options) {
  return {
    CUR_MERGE_BRANCH: `The current merge branch is ${config.branch}`,
    CONTENT_IS_UPTODATE: 'Current branch content is up-to-date, no need to push',
    SELECT_CHANGE_TYPE: 'Please select the type of change:',
    INPUT_CHANGE_MODULE: 'Please input the module you want to change:',
    INPUT_CHANGE_MESSAGE: 'Please input commit message:',
    CHANGE_TYPE_FEAT: 'feat: A new feature',
    CHANGE_TYPE_FIX: 'fix: A bug fix',
    CHANGE_TYPE_DOCS: 'docs: Documentation only changes',
    CHANGE_TYPE_STYLE:
      'style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    CHANGE_TYPE_REFACTOR: 'refactor: A code change that neither fixes a bug nor adds a feature',
    CHANGE_TYPE_PERF: 'perf: A code change that improves performance',
    CHANGE_TYPE_TEST: 'test: Adding missing tests',
    CHANGE_TYPE_CHORE: 'chore: Changes to the build process or auxiliary tools and libraries',
    CHANGE_TYPE_REVERT: 'revert: Revert to a commit',
    CUR_BRANCH_NOT_EXIST: 'Current branch does not exist, do you want to create it?',
    CUR_BRANCH_HAS_CHANGE: 'Current branch has new content, do you want to commit it?',
    CUR_BRANCH_START_PUSH:
      'There is content in the current branch staging area. Would you like to submit it now?',
    SELECT_MERGE_BRANCH: 'Please select the branch you want to merge:',
    MERGE_SUCCESS: 'Merge successfully🎉🎉🎉',
    MERGE_FAIL_CONFLICT:
      'The merge branch failed. After resolving the conflict, execute the following command:',
    NETWORK_FAIL:
      'There is a problem with the network connection, please check the current network!',
    CLI_INIT_DESC: 'Add the script command under package.json',
    CLI_PUSH_DESC: 'Push the current branch to remote',
    CLI_MERGE_DESC: 'Merge the current branch to another remote branch',
    CLI_COMMIT_DESC: 'Add commit information',
    CLI_BRANCH_DESC: 'Branches to be merged, multiple separated by spaces',
    CLI_FORCE_DESC: 'Automatically created when branch does not exist',
    CLI_PUBLISH_LATEST_DESC: 'Publish the latest patch version',
    PUBLISH_SELECT_VERSION: 'Please select the version you want to publish:',
    PUBLISH_INPUT_VERSION: 'Please input the version you want to publish:',
    PUBLISH_CUSTOM_VERSION: 'Custom version number',
    PUBLISH_VERSION_EXIST: 'The version number you entered exists or is empty, please re-enter: ',
    PUBLISH_CURRENT_VERSION: `The current version is: ${config.version}`,
    PUBLISH_NOT_NPM: 'Please use npm to execute this command',
    PUBLISH_SUCCESS: 'Publish successfully🎉🎉🎉',
  };
}
