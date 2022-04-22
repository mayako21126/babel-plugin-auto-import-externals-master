/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2019-11-19 13:49:00
 * @LastEditors: mayako
 * @LastEditTime: 2022-04-22 10:12:44
 */
const {getUrl,getExternals} = require('./utils');

function autoImportMaster(options) {
  this.options = options;
  this.options.setting.externals = getExternals(options.setting.importObj || {}) ? getExternals(options.setting.importObj || {}) : {}
  this.options.setting.url = getUrl(options.setting.importObj || {})
}
autoImportMaster.prototype.apply = function (compiler) {
  compiler.options.externals = compiler.options.externals ? Object.assign(compiler.options.externals, this.options.setting.externals) : this.options.setting.externals
  let setting = this.options.setting
  compiler.hooks.compilation.tap('autoImportMaster', function (compilation, options) {
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('autoImportMaster', function (htmlPluginData, callback) {
      // externals js
      let assets = []
      // app.js
      let autoModules = []
      // app.js
      let mapConfig = {}
      // externals modules name
      // prefetch 
      let preMod = ''
      
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
      // 和preMod都是保留逻辑，后面改造会用得上
      // let tmp = [
      //   autoModules,
      //   assets
      // ]
      
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
    });
  });
};

module.exports = autoImportMaster;