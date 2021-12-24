## Introduction
1. Execute commands to automatically push code to remote servers, no more manual add, commit, push; 
2. Execute the command to directly select the merge code to other branches and push it to the remote, automatically cutting back to the original branch

中文文档：[README_zh.md](./README_zh.md)

## Install
```bash
# yarn
yarn add git-auto-merge

#npm
npm install git-auto-merge
```

## Use
Perform initialization after installation: `npx git-auto-init`

Code Push: `npm run gp` or `npx git-auto-push`

Code Merge: `npm run gm` or `npx git-auto-merge`

## Optional
Create gm.config.js in the root of the project: 
```js
module.exports = {
  mergeBranch: [], // Mergeable branches, read all branches if not written by default
  mergeDefault: [], // Default merged branches
  callback: () => {}, // Execute the callback after the merge is complete
}
```
