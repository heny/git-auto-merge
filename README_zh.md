中文文档 | [English](README.md)

## 示例
### 代码推送
![img](./assets/auto-push.gif)

### 代码合并
![img](./assets/auto-merge.gif)


## 简介
1. 执行命令自动推送代码到远程服务器，不用再手动add、commit、push; 
2. 执行命令可直接选择合并代码到其他分支，并推送到远程，自动切回原来的分支

## 安装
建议安装在全局，也可以在本地安装：
```bash
# yarn
yarn global add git-auto-merge

#npm
npm install git-auto-merge -g
```

## 使用
Code Push: `git-auto-push`

Code Merge: `git-auto-merge`

## 可选项
### 添加命令
执行初始化 `git-auto-init` 会自动帮你在package.json添加以下内容：

```json
{
  "scripts": {
    "gp": "git-auto-push",
    "gm": "git-auto-merge"
  }
}
```

### 添加配置
在你的项目根目录创建文件 gm.config.js

```js
module.exports = {
  /** 合并分支，默认读取所有分支 */
  mergeBranch: [],

  /** 默认合并分支 */
  mergeDefault: [],

  /** 执行后的回调 */
  callback: () => {},

  /** 日志前缀 */
  logPrefix: '',

  /** 默认commit信息 */
  commitDefault: {
    type: 'feat',
    module: 'index',
    message: 'logic',
  },
}
```