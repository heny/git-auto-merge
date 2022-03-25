export interface Config {
  merge?: {
    /** Mergeable branches, read all branches if not written by default */
    branch?: Array<string>;
    /** Default merged branches */
    default?: Array<string>;
  };

  publish?: {
    /** Publish branch */
    branch?: string;
    /** auto create Tag: v1.0.0 */
    tag?: boolean;
    /** Automatic release of the latest patch version at release time */
    latest?: boolean;
  };

  /** Execute the callback after the merge is complete */
  callback?: (command: CommandName) => any;

  /** Log prefix */
  logPrefix?: string;

  /** Default commit information */
  commitDefault?: {
    type?: string;
    module?: string;
    message?: string;
  };
}

export interface ExecOptions {
  errCaptrue?: boolean;
  log?: boolean;
  [key: string]: any;
}

export type CommandName = 'push' | 'merge' | 'publish';

export interface GmOptions {
  /** 需要提交的commit */
  commit?: string;
  /** 需要合并的分支 */
  branch?: string[];
  /** 分支不存在，自动创建 */
  force?: boolean;
  /** 发布最新版本 */
  latest?: boolean;
  /** 发布分支 */
  publishBranch?: string;
  /** 是否添加标签 */
  tag?: boolean | string;
  /** 只提交部分文件 */
  part?: boolean;
  /** 查看详细的描述信息 */
  debug?: boolean;
  /** 当前命令名字：push、publish、merge */
  commandName?: CommandName;
}

export type Types =
  | 'Object'
  | 'Array'
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Function'
  | 'RegExp'
  | 'Date'
  | 'Error'
  | 'Symbol'
  | 'Null'
  | 'Undefined';
