English | [中文文档](./README_zh.md)

## Example

### Code Push
![img](https://s4.ax1x.com/2021/12/27/TBRXFO.gif)

### Code Merge
![img](https://s4.ax1x.com/2021/12/27/TBRol9.gif)

## Introduction
1. Execute commands to automatically push code to remote servers, no more manual add, commit, push; 
2. Execute the command to directly select the merge code to other branches and push it to the remote, automatically cutting back to the original branch

## Install
Can be installed locally or global: 

```bash
# yarn
yarn add git-auto-merge

# npm
npm install git-auto-merge
```

## Usage
Code Push: `git-auto push` or `git-auto push -m 'feat(src): logic'`

Code Merge: `git-auto merge` or `git-auto merge -m 'feat(src): logic' -b uat sit`

Code Publish: `git-auto publish` or `git-auto publish -m 'feat(src): logic' -b uat sit -p master -lt`

View help: `git-auto -h`

## Optional
### Add Command
Executing the initialization `git-auto init` will automatically add the following to package.json for you.
```json
{
  "scripts": {
    "gp": "git-auto push",
    "gm": "git-auto merge"
  }
}
```

### Add Configuration
Create gm.config.js in the root of the project: 
```ts
module.exports = {
  merge: {
    /** Mergeable branches, read all branches if not written by default */
    branch: [],
    /** Default merged branches */
    default: [],
  },
  publish: {
    /** Publish branch */
    branch: 'master',
    /** auto create Tag: v1.0.0 */
    tag: true,
    /** Automatic release of the latest patch version at release time */
    latest: true
  },

  /** Log prefix */
  logPrefix: '',

  /** Default commit information */
  commitDefault: {
    type: 'feat',
    module: 'index',
    message: 'logic',
  },

  /** Execute the callback after the merge is complete */
  callback: (commandName: 'push' | 'merge' | 'publish') => {},
}
```
