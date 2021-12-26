export enum STATUS {
  /** Need to add commit */
  COMMIT = 'Changes',

  /** Direct push */
  PUSH = 'to publish your local commits',

  /** Content is the latest */
  UPDATED = 'branch is up to date',

  /** Current branch distal does not exist */
  NONE = 'none',
}

export enum Colors {
  black = '30',
  red = '31',
  green = '32',
  yellow = '33',
  blue = '34',
  magenta = '35',
  cyan = '36',
  white = '37',
  default = '36',
}
