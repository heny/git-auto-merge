## DOCUMENTATION

### 自动代码合并
#### Install：
```bash
# yarn
yarn add git-auto-merge

#npm
npm install git-auto-merge
```

#### Use: 
安装成功之后执行：`npx git-auto-init`
在项目根目录创建gm.config.js：
```js
module.exports = {
  mergeBranch: ['sit', 'uat'], // 可合并的分支
  mergeDefault: ['sit', 'uat'], // 默认合并到的分支
}
```

代码推送：`npm run gp` or `npx git-auto-push`
代码合并：`npm run gm` or `npx git-auto-merge`