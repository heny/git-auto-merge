import { Colors } from './constant';

export interface Config {
  /** Mergeable branches, read all branches if not written by default */
  mergeBranch: string[];

  /** Default merged branches */
  mergeDefault: string[];

  /** Execute the callback after the merge is complete */
  callback: () => any;

  /** Log prefix */
  logPrefix: string;

  /** Default commit information */
  commitDefault: {
    type: string;
    module: string;
    message: string;
  };
}

export type ColorKey = keyof typeof Colors;

export interface ExecOptions {
  errCaptrue?: boolean;
  log?: boolean;
  [key: string]: any;
}

export interface GmOptions {
  commit?: string;
  branch?: string[];
  /** Branches are not created automatically */
  force?: boolean;
}

export interface PushOptions {
  /** Is it triggered by merge */
  isMerge?: boolean;
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

export type VersionType = 'patch' | 'minor' | 'major';
