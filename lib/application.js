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
    // this.fn
    this.middlewares = []; // 需要一个数组 将每一个中间件按照顺序存放起来
    // 使用Object.create clone一份 互不影响
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  use(fn) {
    // this.fn = fn; // 使用use 函数的时候 回调赋值给this.fn
    if(typeof fn !== 'function')  throw new Error('中间件必须是一个函数')
    this.middlewares.push(fn)
  }
  listen(...args) {
    let sever = http.createServer(this.handleRequest.bind(this)); // 放入回调函数
    sever.listen(...args); // 因为listen 方法可能有很多参数， 所以直接结构赋值就行
  }
  // 创建ctx
  createContext(req, res) {
    const ctx = this.context
    const request = ctx.request = this.request;
    const response = ctx.response =this.response;

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
    let fn = this.compose(this.middlewares, ctx);
    fn.then(() => {
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
    }).catch(err => {
      this.emit('error', err)
      res.statusCode = 500
      res.end('server error')
    })
  }
  //  简易的compose 接收中间件数组 和 ctx 
  // compose(middlewares, ctx) { // 简化版的compose，接收中间件数组、ctx对象作为参数
  //   function dispatch(index) { // 利用递归函数将各中间件串联起来依次调用
  //     if (index === middlewares.length) return // 最后一次next不能执行，不然会报错
  //     let middleware = middlewares[index] // 取当前应该被调用的函数
  //    return middleware(ctx, () => dispatch(index + 1)) // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
  //   }
  //   dispatch(0)
  // }
  compose(middlewares, ctx) { // 简化版的compose，接收中间件数组、ctx对象作为参数
    function dispatch(index) { // 利用递归函数将各中间件串联起来依次调用
      if (index === middlewares.length) return Promise.resolve() // 最后一次next不能执行，不然会报错
      let middleware = middlewares[index] // 取当前应该被调用的函数
      return Promise.resolve(middleware(ctx, () => dispatch(index + 1)))
    }
    return dispatch(0)
  }
}

module.exports = Koa