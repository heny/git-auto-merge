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
