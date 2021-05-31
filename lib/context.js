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
 * @api private
 */
function defineGetter(prop, name) { // 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性
  //   __defineGetter__ 属于非官方推荐，未来版本将要废弃
  // proto.__defineGetter__(name, function () { // 每个对象都有一个__defineGetter__方法，可以用这个方法实现代理，
  //   return this[prop][name] 
  // })
  Object.defineProperty(proto, name, {
    get() {
      return this[prop][name]
    },
    configurable: true
  })
}
/**
 * 
 * @param {*} prop  要代理的对象
 * @param {*} name  对象上的属性
 * @api private
 */
function defineSetter(prop, name) {
  //  __defineSetter__ 属于非官方方法，未来计划废弃掉 支持 因此采用 Object.defineProperty
  // proto.__defineSetter__(name, function(val){ // 用__defineSetter__方法设置值 
  //     this[prop][name] = val
  // })
  Object.defineProperty(proto, name, {
    set(val) {
      this[prop][name] = val
    },
    configurable: true
  })
}
//  仅仅简单写几项 url  path  body 剩下还有header 等
defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('response', 'body') // 同样代理response的body属性
defineSetter('response', 'body') // 同理

// 优雅写法 数组遍历



module.exports = proto;