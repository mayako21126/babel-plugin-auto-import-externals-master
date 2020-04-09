/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2019-11-19 13:49:00
 * @LastEditors: mayako
 * @LastEditTime: 2020-04-09 15:05:12
 */
function getUrl(obj) {
  let tmp = []
  Object.keys(obj).forEach(function (key) {
    tmp.push(obj[key].url)
  });
  return tmp
}

function getExternals(obj) {
  let tmp = {}
  Object.keys(obj).forEach(function (key) {
    tmp[key] = obj[key].name
  });
  return tmp
}

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
      // externals modules name
      htmlPluginData.assets.js.forEach(function (key) {
        assets.push(key)
      })
      Object.keys(setting.importObj || {}).forEach(function (key) {
        autoModules.push(setting.importObj[key].name)
      })
      htmlPluginData.assets.js.length = 0
      let tmp = [
        autoModules,
        assets
      ]
      
      let tmp3 = `<script>let p = [];
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
      htmlPluginData.html = htmlPluginData.html.replace(/<\/body>/, tmp3 + '</body>')
    });
  });
};

module.exports = autoImportMaster;