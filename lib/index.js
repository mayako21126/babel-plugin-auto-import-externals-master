/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2019-11-19 13:49:00
 * @LastEditors: mayako
 * @LastEditTime: 2022-04-22 14:28:57
 */
const webpackVersion = require.main.require('webpack/package.json').version;

/**
 * @param {boolean} [onlyMajor=true]
 * @return {string}
 */
function getWebpackVersion(onlyMajor = true) {
  return onlyMajor ? webpackVersion.split('.')[0] : webpackVersion;
}

getWebpackVersion.IS_1 = getWebpackVersion() === '1';
getWebpackVersion.IS_2 = getWebpackVersion() === '2';
getWebpackVersion.IS_3 = getWebpackVersion() === '3';
getWebpackVersion.IS_4 = getWebpackVersion() === '4';
getWebpackVersion.IS_5 = getWebpackVersion() === '5';

let autoImportMaster = null;

if (getWebpackVersion.IS_5) {
  // webpack5 and upper
  autoImportMaster = require('./wp5.js');
} else {
  // webpack4 and lower
  autoImportMaster = require('./wp4.js');
}


module.exports = autoImportMaster;