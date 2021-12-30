// import merge from './merge';
// import { VersionType } from './common/interface';
// import { exec, preLog, getExecTool, prompt } from './utils';

// /**
//  * patch 0.0.*
//  * minor 1.*.0
//  * major *.0.0
//  */

// function byTypeGetVersion(version: any, versionType: VersionType): string {
//   version = version.split('.');
//   switch (versionType.toLowerCase()) {
//     case 'minor':
//       version[1] = ++version[1];
//       break;
//     case 'major':
//       version[0] = ++version[0];
//       break;
//     case 'patch':
//     default:
//       version[2] = ++version[2];
//   }
//   return version.join('.');
// }
