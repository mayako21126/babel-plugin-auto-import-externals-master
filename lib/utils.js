/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2022-04-22 10:00:43
 * @LastEditors: mayako
 * @LastEditTime: 2022-04-22 14:28:45
 */
exports.getUrl = function(obj) {
  let tmp = []
  Object.keys(obj).forEach(function (key) {
    tmp.push(obj[key].url)
  });
  return tmp
}

exports.getExternals = function(obj) {
  let tmp = {}
  Object.keys(obj).forEach(function (key) {
    if(obj[key].onlyPre !==true){
      tmp[key] = obj[key].name
    }
  });
  return tmp
}