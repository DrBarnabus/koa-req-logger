# Explanation
Due to the way that the [koa-router](https://github.com/alexmingoia/koa-router) module throws errors in its allowedMethods middleware, they are not caught by the error handler in this request logging module. To resolve this issue the following config needs to be added to the middlware function.

```js
const Koa = require('koa');
const KoaReqLogger = require('koa-req-logger');
const Router = require('koa-router');
const createError = require('http-errors');

const app = new Koa();
const logger = new KoaReqLogger();

app.use(logger.getMiddleware());

const router = new Router();

app.use(router.routes());

// Add these custom options to the allowedMethods() middleware
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => {
    return createError(501, 'Not Implemented');
  },
  methodNotAllowed: () => {
    return createError(405, 'Method Not Allowed');
  }
}));
```