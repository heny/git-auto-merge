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

  // Bright color
  blackBright = '90',
  redBright = '91',
  greenBright = '92',
  yellowBright = '93',
  blueBright = '94',
  magentaBright = '95',
  cyanBright = '96',
  whiteBright = '97',

  // Background color
  bgBlack = '40',
  bgRed = '41',
  bgGreen = '42',
  bgYellow = '43',
  bgBlue = '44',
  bgMagenta = '45',
  bgCyan = '46',
  bgWhite = '47',

  // Bright background color
  bgBlackBright = '100',
  bgRedBright = '101',
  bgGreenBright = '102',
  bgYellowBright = '103',
  bgBlueBright = '104',
  bgMagentaBright = '105',
  bgCyanBright = '106',
  bgWhiteBright = '107',
}
