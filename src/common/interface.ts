import { Colors } from './constant';

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
    autoCreateTag?: boolean;
    /** Automatic release of the latest patch version at release time */
    latest?: boolean;
  };

  /** Execute the callback after the merge is complete */
  callback?: () => any;

  /** Log prefix */
  logPrefix?: string;

  /** Default commit information */
  commitDefault?: {
    type?: string;
    module?: string;
    message?: string;
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
  /** Branch does not exist, automatically created */
  force?: boolean;
  latest?: boolean;
  publishBranch?: string;
  tag?: boolean | string;
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
