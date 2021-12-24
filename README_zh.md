## 简介
1. 执行命令自动推送代码到远程服务器，不用再手动add、commit、push; 
2. 执行命令可直接选择合并代码到其他分支，并推送到远程，自动切回原来的分支

## 安装
```bash
# yarn
yarn add git-auto-merge

#npm
npm install git-auto-merge
```

## 使用
安装完成之后进行初始化: `npx git-auto-init`

Code Push: `npm run gp` or `npx git-auto-push`

Code Merge: `npm run gm` or `npx git-auto-merge`

## 可选项
在你的项目根目录创建文件 gm.config.js

```js
module.exports = {
  mergeBranch: [], // 合并分支，默认读取所有分支
  mergeDefault: [], // 默认合并的分支
  callback: () => {}, // 命令完成后执行的回调
}
```
