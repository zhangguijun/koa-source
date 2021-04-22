/**
 * 主入口文件
 * @description koa 是一个类 实例上主要两个方法 use listen （http.createServer）
 * 
 */
const http = require('http');
const EventEmitter = require('events');

let context = require('./context');
let request = require('./request');
let response = require('./response');

class Koa extends EventEmitter {
  constructor() {
    super();
    this.fn
  }

  use(fn) {
    this.fn = fn; // 使用use 函数的时候 回调赋值给this.fn
  }
  listen(...args) {
    let sever = http.createServer(this.fn); // 放入回调函数
    sever.listen(...args); // 因为listen 方法可能有很多参数， 所以直接结构赋值就行
  }
}

module.exports = Koa