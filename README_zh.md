中文文档 | [English](README.md)

## 示例
### 推送
**快速合并**
![git-auto-push-quick.gif](https://pic.peo.pw/a/2022/10/18/634d894cd74a1.gif)

**选择选项合并**
![git-auto-push.gif](https://pic.peo.pw/a/2022/10/18/634d894b00c30.gif)

### 合并
**快速合并**
![git-auto-merge-quick.gif](https://pic.peo.pw/a/2022/10/18/634d894b8bc2c.gif)

**选择选项合并**
![git-auto-merge.gif](https://pic.peo.pw/a/2022/10/18/634d894b899c4.gif)


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

## 文档
```
Usage: git-auto <command> [options]

Options:
  -h, --help                             查看帮助
  -v, --version                          输出当前版本号
  --debug                                查看详细的输出信息
  -m, --commit <commit>                  [push] 添加提交信息
  --part                                 [push] 只提交部分文件
  -f, --force                            [push] 强制提交
  -b, --branch <branch...>               [merge] 要合并的分支，多个用空格分隔
  -l, --latest                           [publish] 发布最新的patch版本
  -p, --publish-branch <publish-branch>  [publish] 填写一个分支名称，发布到npm
  -t, --tag [tag-name]                   [publish] 发布时创建tag，可以空格写名称

Commands:
  init                                   在package.json下添加脚本命令
  push                                   推送当前分支到远程仓库
  merge                                  合并分支到当前其他分支
  publish                                发布代码到npm
```

## 使用
代码推送: `git-auto push` or `git-auto push -m 'feat(src): logic'`

代码合并: `git-auto merge` or `git-auto merge -m 'feat(src): logic' -b uat sit`

代码发布: `git-auto publish` or `git-auto publish -m 'feat(src): logic' -b uat sit -p master -lt`

查看帮助: `git-auto -h`

## 可选项
### 添加命令
执行初始化 `git-auto init` 会自动帮你在package.json添加以下内容：

```json
{
  "scripts": {
    "gp": "git-auto push",
    "gm": "git-auto merge"
  }
}
```

### 添加配置
在你的项目根目录创建文件 gm.config.js

```js
module.exports = {
  merge: {
    /** 合并分支，默认读取所有分支 */
    branch: [],
    /** 默认合并分支 */
    default: [],
  },
  publish: {
    /** 发布的分支 */
    branch: '',
    /** 发布分支后自动创建tag */
    tag: true,
    /** 在发布时自动发布最新版本 */
    latest: true
  },

  /** 日志前缀 */
  logPrefix: '',
  
  /** 默认commit信息 */
  commitDefault: {
    type: 'feat',
    module: 'index',
    message: 'logic',
  },

  /** 执行后的回调，可以通过不同的命令做不同的事 */
  callback: (commandName: 'push' | 'merge' | 'publish') => {},
}
```
