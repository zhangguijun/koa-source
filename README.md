# koa-source
koa 简单实现
### koa api 

![koa](./images/koa-source-img.png)
### 思路分析

- 无非就是use 的时候拿到回调函数， listen 的时候执行这个回调函数
- use回调参数的ctx 扩展了很多功能 ctx 其实就是原生的req， res 经过一些列处理产生的
- use 可以多次， 所以会有多个回调函数 用户的第二个参数next 跳到下一个， 把多个use 的回调函数按照规则顺序执行


### 难点
 - 如何将原生的req 和res 加工到 ctx  
 - 如何实现一个中间件(处理多个回调函数)