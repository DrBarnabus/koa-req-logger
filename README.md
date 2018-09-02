# Introduction
[![NPM Version][npm-badge]][npm-url]
[![NPM Downloads][npmd-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Test Coverage][codecov-badge]][codecov-url]
[![Dependencies][dependencies-badge]][dependencies-url]
[![devDependencies][devDependencies-badge]][devDependencies-url]
[![Known Vulnerabilities][snyk-badge]][snyk-url]

A simple logging middleware for the [koa] http framework for nodejs. This module uses the [pino] logger and was inspired by the [koa-pino-logger] module.

As well as logging requests and providing a log object in requests, this module also sets the HTTP Headers Date, X-Response-Time and X-Request-ID.

- The X-Request-ID HTTP Header is either set to a new uuid or the value of the X-Request-ID passed in the request so that requests can be tracked through multiple services.
- The Date HTTP Header is set to the date that the request was recieved with the API.
- The X-Response-Time HTTP Header is set as the response time in milliseconds.

## Contents
- [Install](#Install)
- [Usage](#Usage)
- [Caveats](#Caveats)
- [Test](#Test)
- [License](#License)

# Install
```
npm install koa-req-logger
```

# Usage

For a full API Reference see the documentation [here⇗](docs/api-reference.md).

```js
const Koa = require('koa');
const KoaReqLogger = require('koa-req-logger');

const app = new Koa();

const logger = new KoaReqLogger();
app.use(logger.getMiddleware());

app.use((ctx, next) => {
  ctx.log.info('Some Log Message');
  ctx.log.warn({ obj: 'object' }, 'Log a message with an object');

  ctx.throw(400, 'Bad Request');
});

app.listen(3000);
```

Produces a similar output to the following json, which can then be parsed with pino's shell utility to pretty-print the output.

```json
{"level":30,"time":1532251116578,"msg":"::1 - GET /","pid":4992,"hostname":"server.local","id":"ff0bae4b-b067-4cd6-8b99-5d221e74c515","req":{"method":"GET","url":"/","headers":{"host":"localhost:3000","connection":"keep-alive","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-encoding":"gzip, deflate, br","accept-language":"en-GB,en-US;q=0.9,en;q=0.8"}},"startDate":"Sun, 22 Jul 2018 09:18:36 GMT","v":1}
{"level":30,"time":1532251116579,"msg":"Some Log Message","pid":4992,"hostname":"server.local","id":"ff0bae4b-b067-4cd6-8b99-5d221e74c515","v":1}
{"level":40,"time":1532251116579,"msg":"Log a message with an object","pid":4992,"hostname":"server.local","id":"ff0bae4b-b067-4cd6-8b99-5d221e74c515","obj":"object","v":1}
{"level":50,"time":1532251116583,"msg":"::1 - GET / - 400 4ms","pid":4992,"hostname":"server.local","id":"ff0bae4b-b067-4cd6-8b99-5d221e74c515","res":{"status":400,"headers":{"x-request-id":"ff0bae4b-b067-4cd6-8b99-5d221e74c515","date":"Sun, 22 Jul 2018 09:18:36 GMT","x-response-time":"4ms","content-type":"application/json; charset=utf-8"}},"err":{"type":"ClientError","message":"Bad Request","stack":"BadRequestError: Bad Request\n    at Object.throw (/home/drbarnabus/Development/test-service/node_modules/koa/lib/context.js:96:11)...","status":400,"statusCode":400,"expose":true},"responseTime":4,"startDate":"Sun, 22 Jul 2018 09:18:36 GMT","v":1}
```

# Caveats
## koa-router allowedMethods()
When using the [koa-router] allowedMethods middleware, the response errors are not caught by the error logger and are instead logged as successful requests. In most applications this is fine, but in the instance that you want these failures to be logged as errors you need to log these as errors follow the instructions [here⇗](docs/koa-router-allowedMethods-fix.md).

# Test
```
npm test
```

# License
Licensed under [MIT](./LICENSE).

<!-- Links --->
[koa]: https://github.com/koajs/koa
[pino]: https://github.com/pinojs/pino
[koa-pino-logger]: https://github.com/pinojs/koa-pino-logger
[koa-router]: https://github.com/alexmingoia/koa-router

<!-- Badges --->
[npm-badge]: https://img.shields.io/npm/v/koa-req-logger.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-req-logger
[npmd-badge]: https://img.shields.io/npm/dw/koa-req-logger.svg?style=flat-square
[travis-badge]: https://img.shields.io/travis/DrBarnabus/koa-req-logger/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/DrBarnabus/koa-req-logger
[dependencies-badge]: https://david-dm.org/drbarnabus/koa-req-logger.svg?style=flat-square
[codecov-badge]: https://img.shields.io/codecov/c/github/DrBarnabus/koa-req-logger/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/DrBarnabus/koa-req-logger
[dependencies-url]: https://david-dm.org/drbarnabus/koa-req-logger
[devDependencies-badge]: https://david-dm.org/drbarnabus/koa-req-logger/dev-status.svg?style=flat-square
[devDependencies-url]: https://david-dm.org/drbarnabus/koa-req-logger?type=dev
[snyk-badge]: https://snyk.io/test/github/DrBarnabus/koa-req-logger/badge.svg?targetFile=package.json&style=flat-square
[snyk-url]: https://snyk.io/test/github/DrBarnabus/koa-req-logger?targetFile=package.json