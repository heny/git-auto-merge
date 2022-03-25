## 0.6.0 (2022-03-25)
- push之前先fetch ([b8f4687](https://github.com/heny/git-auto-merge/commit/b8f4687))
- 调整拉取代码为merge  ([d187fc2](https://github.com/heny/git-auto-merge/commit/d187fc2))
- force参数改为强制提交  ([84487d4](https://github.com/heny/git-auto-merge/commit/84487d4))

## 0.5.1 (2022-03-16)
- 修复合并分支时两次push ([3cb8970](https://github.com/heny/git-auto-merge/commit/3cb8970))

## 0.5.0 (2022-03-16)
- 获取版本号调整 ([dc43d24](https://github.com/heny/git-auto-merge/commit/dc43d24))
- 发布时，如果package里version不存在，则不再修改版本号 ([cf19004](https://github.com/heny/git-auto-merge/commit/cf19004))

## 0.4.0 (2022-03-15)
- status校验调整为simple-git插件 ([95db882](https://github.com/heny/git-auto-merge/commit/95db882))

## 0.3.0 (2022-02-16)
- 发布版本号调整 ([5df0bca](https://github.com/heny/git-auto-merge/commit/5df0bca))

## 0.2.1 (2022-01-18)
- 版本选择优化 ([731a7a5](https://github.com/heny/git-auto-merge/commit/731a7a5))

## 0.2.0 (2022-1-14)
- 修复获取版本时，拿到的是当前项目的bug ([b3c9287](https://github.com/heny/git-auto-merge/commit/b3c9287))
- 本地不是最新再拉取代码 ([2dfd091](https://github.com/heny/git-auto-merge/commit/2dfd091))
- 修复shell脚本输出带\n ([6436146](https://github.com/heny/git-auto-merge/commit/6436146))
- 优化发布版本时,版本列表选择 ([d1142d5](https://github.com/heny/git-auto-merge/commit/d1142d5))

## 0.1.3 (2022-1-13)
- 修复上传的dist文件不是最新的bug

## 0.1.2 (2022-1-13)
- 添加输出版本 git-auto -v ([2b1be6fe](https://github.com/heny/git-auto-merge/commit/2b1be6fe))
- 输出颜色工具变更 chalk ([2b1be6fe](https://github.com/heny/git-auto-merge/commit/2b1be6fe))
- 调整别名引入 ([2b1be6fe](https://github.com/heny/git-auto-merge/commit/2b1be6fe))

## 0.1.1 (2022-1-12)
- publish tag字段调整，autoCreateTag --> tag
- 添加 --part 支持提交部分文件

## 0.1.0 (2022-1-4)
- 增加CHANGELOG ([9142fb6c](https://github.com/heny/git-auto-merge/commit/9142fb6c))
- commit新增build、ci
- 修复检测文件变更状态 ([9ca5ffbf](https://github.com/heny/git-auto-merge/commit/9ca5ffbf))
- prompts 工具更换 ([6d541a4d](https://github.com/heny/git-auto-merge/commit/6d541a4d))

## 0.0.44 (2022-1-2)
- 回调函数增加当前执行命令参数

## 0.0.43 (2022-1-2)
- callback执行时间更改

## 0.0.42 (2022-1-2)
- publish 消耗时间更改

## 0.0.41 (2022-1-1)
- 更新帮助信息

## 0.0.40 (2022-1-1)
- 调整publish参数命令

## 0.0.38 (2021-12-31)
- 修复分支获取规则

## 0.0.37 (2021-12-31)
- 调整config结构
- 发布增加创建标签