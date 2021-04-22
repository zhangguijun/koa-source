/**
 * 上下文相关对象
 * 
 */

let proto = {}
/**
 * 
 * @param {*} prop  要代理的对象
 * @param {*} name  对象上的属性
 * @description 
 */
function defineGetter(prop, name) { // 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性
  proto.__defineGetter__(name, function () { // 每个对象都有一个__defineGetter__方法，可以用这个方法实现代理，下面详解
    return this[prop][name] // 这里的this是ctx（原因下面解释），所以ctx.url得到的就是this.request.url
  })
}

function defineSetter (prop, name) {
  proto.__defineSetter__(name, function(val){ // 用__defineSetter__方法设置值
      this[prop][name] = val
  })
}
defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('response', 'body') // 同样代理response的body属性
defineSetter('response', 'body') // 同理

module.exports = proto;