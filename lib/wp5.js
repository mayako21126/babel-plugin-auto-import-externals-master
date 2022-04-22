/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2022-04-22 09:59:09
 * @LastEditors: mayako
 * @LastEditTime: 2022-04-22 10:20:16
 */
const {getUrl,getExternals} = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function autoImportMaster(options) {
  this.options = options;
  this.options.setting.externals = getExternals(options.setting.importObj || {}) ? getExternals(options.setting.importObj || {}) : {}
  this.options.setting.url = getUrl(options.setting.importObj || {})
}

autoImportMaster.prototype.apply = function (compiler) {
  compiler.options.externals = compiler.options.externals ? Object.assign(compiler.options.externals, this.options.setting.externals) : this.options.setting.externals
  let setting = this.options.setting
  // externals js
  let assets = []
  // app.js
  let autoModules = []
  // app.js
  let mapConfig = {}
  // externals modules name
  // prefetch 
  let preMod = ''
  // console.log(htmlPluginData.assets.js)
  compiler.hooks.compilation.tap('autoImportMaster', function (compilation, options) {
    HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('autoImportMaster',
    (htmlPluginData, cb) => {
      htmlPluginData.assets.js.forEach(function (key) {
        assets.push(key)
      })
      Object.keys(setting.importObj || {}).forEach(function (key) {
        autoModules.push(setting.importObj[key].name)
        preMod += `<link rel='prefetch' href='${setting.importObj[key].url}'>`
        if(setting.importObj[key].alias){
          autoModules.push(setting.importObj[key].alias)
          mapConfig[setting.importObj[key].alias] = setting.importObj[key].fakeurl
          preMod += `<link rel='prefetch' href='${setting.importObj[key].fakeurl}'>`
        }
        mapConfig[setting.importObj[key].name] = setting.importObj[key].url
      })
      htmlPluginData.assets.js.length = 0
      // Tell webpack to move on
      cb(null, htmlPluginData)
    })
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('autoImportMaster',
    (htmlPluginData, cb) => {
      // console.log(htmlPluginData.assets.js)
      let tmp3 = `<script>
      SystemJS.config({
        map: ${JSON.stringify(mapConfig)}
      })
      let p = [];
      let m = ${JSON.stringify(autoModules)};
      m.forEach((item) => {
        const pi = SystemJS.import(item)
        p.push(pi)
      });
      Promise.all(p).then((list) => {
        list.forEach((item, i) => {
          window[m[i]] = item
        });
        let x = ${JSON.stringify(assets)}
        x.forEach((item) => {
          SystemJS.import(item)
        });
      });</script>`
      if(preMod){
        htmlPluginData.html = htmlPluginData.html.replace(/<\/head>/, preMod + '</head>')
      }
      htmlPluginData.html = htmlPluginData.html.replace(/<\/body>/, tmp3 + '</body>')
      // Tell webpack to move on
      cb(null, htmlPluginData)
    })
  });
};

module.exports = autoImport;