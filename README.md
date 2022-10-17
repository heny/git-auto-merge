English | [中文文档](./README_zh.md)

## Example

### Push
**Quick**
![git-auto-push-quick.gif](https://pic.peo.pw/a/2022/10/18/634d894cd74a1.gif)

**with the option**
![git-auto-push.gif](https://pic.peo.pw/a/2022/10/18/634d894b00c30.gif)

### Merge
**Quick**
![git-auto-merge-quick.gif](https://pic.peo.pw/a/2022/10/18/634d894b8bc2c.gif)

**with the option**
![git-auto-merge.gif](https://pic.peo.pw/a/2022/10/18/634d894b899c4.gif)

## Introduction
1. Execute commands to automatically push code to remote servers, no more manual add, commit, push; 
2. Execute the command to directly select the merge code to other branches and push it to the remote, automatically cutting back to the original branch

## Install
Can be installed locally or global: 

```bash
# yarn
yarn global add git-auto-merge

#npm
npm install git-auto-merge -g
```

## DOCS
```
Usage: git-auto <command> [options]

Options:
  -h, --help                             Display help information
  -v, --version                          output the current version
  --debug                                View detailed output
  -m, --commit <commit>                  [push] Add commit information
  --part                                 [push] Partial submission of documents only
  -f, --force                            [push] force update
  -b, --branch <branch...>               [merge] Branches to be merged, multiple separated by spaces
  -l, --latest                           [publish] Publish the latest patch version
  -p, --publish-branch <publish-branch>  [publish] Fill in a branch name and publish to npm
  -t, --tag [tag-name]                   [publish] Create a tag when publishing, you can write the name after a space

Commands:
  init                                   Add the script command under package.json
  push                                   Push the current branch to remote
  merge                                  Merge the current branch to another remote branch
  publish                                Publish code to npm
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
