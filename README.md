## Install：
```bash
# yarn
yarn add git-auto-merge

#npm
npm install git-auto-merge
```

## Use: 
Perform initialization after installation: `npx git-auto-init`

Code Push: `npm run gp` or `npx git-auto-push`

Code Merge: `npm run gm` or `npx git-auto-merge`

## Optional
Create gm.config.js in the root of the project：
```js
module.exports = {
  mergeBranch: [], // Mergeable branches, read all branches if not written by default
  mergeDefault: [], // Default merged branches
  callback: () => {}, // Execute the callback after the merge is complete
}
```
