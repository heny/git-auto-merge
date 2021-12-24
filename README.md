## Install：
```bash
# yarn
yarn add git-auto-merge

#npm
npm install git-auto-merge
```

## Use: 
The installation performs initialization: `npx git-auto-init`

Code Push: `npm run gp` or `npx git-auto-push`

Code Merge: `npm run gm` or `npx git-auto-merge`

## 分支过多，筛选麻烦
在项目根目录创建gm.config.js: 

The file should export an object containing options:
```js
module.exports = {
  mergeBranch: [], // Mergeable branches, read all branches if not written by default
  mergeDefault: [], // Default merged branches
  callback: () => {}, // Execute the callback after the merge is complete
}
```
