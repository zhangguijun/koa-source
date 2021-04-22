/**
 * 主入口文件
 * @description koa 是一个类 实例上主要两个方法 use listen （http.createServer）
 * 
 */
const http = require('http');
const EventEmitter = require('events');

const Stream = require('stream');

let context = require('./context');
let request = require('./request');
let response = require('./response');
class Koa extends EventEmitter {
  constructor() {
    super();
    this.fn
    this.context = context;
    this.request = request;
    this.response = response;
  }

  use(fn) {
    this.fn = fn; // 使用use 函数的时候 回调赋值给this.fn
  }
  listen(...args) {
    let sever = http.createServer(this.handleRequest.bind(this)); // 放入回调函数
    sever.listen(...args); // 因为listen 方法可能有很多参数， 所以直接结构赋值就行
  }
  // 创建ctx
  createContext(req, res) {
    const ctx = Object.create(this.context);
    const request = ctx.request = Object.create(this.request);
    const response = ctx.response = Object.create(this.response);

    ctx.req = request.req = response.req = req;
    ctx.res = request.res = response.res = res;
    request.ctx = response.ctx = ctx;
    request.response = response;
    response.request = request;

    return ctx;
  }
  //  创建一个处理请求的函数
  handleRequest(req, res) {
    // let ctx = this.createContext(req, res);
    // // console.log(ctx)
    // this.fn(ctx);
    // res.end(ctx.body);

    res.statusCode = '404';
    let ctx = this.createContext(req, res);
    this.fn(ctx);
    if (typeof ctx.body === 'object') {
      res.setHeader('Content-Type', 'application/json;charset=utf8')
      res.end(JSON.stringify(ctx.body))
      //  如果是流对象
    } else if (ctx.body instanceof Stream) {
      ctx.body.pipe(res)
    } else if (typeof ctx.body === 'string') {
      res.setHeader('Content-Type', 'text/htmlcharset=utf8')
      res.end(ctx.body)
    } else {
      res.end('Not found')
    }
  }
}

module.exports = Koa