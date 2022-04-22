/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2022-04-22 10:00:43
 * @LastEditors: mayako
 * @LastEditTime: 2022-04-22 10:10:54
 */
export function getUrl(obj) {
  let tmp = []
  Object.keys(obj).forEach(function (key) {
    tmp.push(obj[key].url)
  });
  return tmp
}

export function getExternals(obj) {
  let tmp = {}
  Object.keys(obj).forEach(function (key) {
    if(obj[key].onlyPre !==true){
      tmp[key] = obj[key].name
    }
  });
  return tmp
}