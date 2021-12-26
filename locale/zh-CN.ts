export default function (config: Record<string, any>) {
  return {
    CUR_PUBLISH_BRANCH: `当前发布分支: ${config.branch}`,
    CONTENT_IS_UPTODATE: '当前分支内容是最新的，无需推送',
    SELECT_CHANGE_TYPE: '请选择需要变更的类型：',
    INPUT_CHANGE_MODULE: '请输入需要变更的模块：',
    INPUT_CHANGE_MESSAGE: '请输入提交信息：',
    CHANGE_TYPE_FEAT: 'feat：新功能(feature)',
    CHANGE_TYPE_FIX: 'fix：修补bug',
    CHANGE_TYPE_DOCS: 'docs：文档变更',
    CHANGE_TYPE_STYLE: 'style：美化(不影响代码运行)',
    CHANGE_TYPE_REFACTOR: 'refactor：重构(即不是新增功能，也不是修补bug的代码变动)',
    CHANGE_TYPE_PERF: 'perf：优化(对代码运行负面影响，但不会影响代码运行)',
    CHANGE_TYPE_TEST: 'test：单元测试',
    CHANGE_TYPE_CHORE: 'chore：构建过程或辅助工具的变动',
    CHANGE_TYPE_REVERT: 'revert：回滚',
    CUR_BRANCH_NOT_EXIST: '当前分支不存在，是否立即创建？',
    CUR_BRANCH_HAS_CHANGE: '当前分支有新的内容，是否现在提交？',
    CUR_BRANCH_START_PUSH: '当前分支暂存区有内容，是否现在提交？',
    SELECT_PUBLISH_BRANCH: '请选择发布分支：',
    PUBLISH_SUCCESS: '发布成功🎉🎉🎉',
    PUBLISH_FAIL_CONFLICT: '合并分支失败，请解决冲突之后，执行以下命令：',
    NETWORK_FAIL: '网络连接异常，请检查当前网络！'
  };
};
