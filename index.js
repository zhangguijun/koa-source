let Koa = require('./lib/application');

let app = new Koa();


// app.use((ctx) => {
//   // res.end('hello world')
//   console.log(ctx.req.url)
//   console.log(ctx.request.req.url)
//   console.log(ctx.response.req.url)
//   console.log(ctx.request.url)
//   console.log(ctx.request.path)
//   console.log(ctx.url)
//   console.log(ctx.path)

//   ctx.body = 'hello world';
//   console.log(ctx.body)
// })
app.use((ctx, next) => {
  console.log(1)
  next()
  console.log(2)
})
app.use((ctx, next) => {
  console.log(3)
  next()
  console.log(4)
})
app.use((ctx, next) => {
  console.log(5)
  next()
  console.log(6)
  ctx.body= {
    code: 1,
    mag: '11'
  }
})

app.listen(3000)