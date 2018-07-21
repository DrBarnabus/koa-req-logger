# Introduction
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
## NPM
```
npm install koa-req-logger
```
## YARN
```
yarn add koa-req-logger
```

# Usage
```js
const KoaLogger = require('koa-req-logger');
const Koa = require('koa');


const app = new Koa();
const logger = new KoaRequestLogger(); // Can also take an options parameter, which is passed to pino.

app.use(logger.getMiddleware());

app.use((ctx) => {
  ctx.log.info({ some: 'object' }, 'Some log message'); // Logger can be used in request and will include request id
  ctx.body = 'Hello World!';
});

app.listen(3000);
```

Produces a similar output to the following json, which can then be parsed with pino's shell utility to pretty-print the output.

```json
{"level":30,"time":1532118543289,"msg":"::ffff:127.0.0.1 - GET /","pid":23929,"hostname":"servername","id":"10fdca70-7afc-41a6-95c2-ead6869fe4fa","req":{"method":"GET","url":"/","headers":{"host":"127.0.0.1:37561","accept-encoding":"gzip, deflate","user-agent":"node-superagent/3.8.2","connection":"close"}},"startDate":"Fri, 20 Jul 2018 20:29:03 GMT","v":1}
{"level":30,"time":1532118543297,"msg":"::ffff:127.0.0.1 - GET / - 200 8ms","pid":23929,"hostname":"servername","id":"10fdca70-7afc-41a6-95c2-ead6869fe4fa","res":{},"responseTime":8,"startDate":"Fri, 20 Jul 2018 20:29:03 GMT","v":1}
```

# Caveats
## koa-router allowedMethods()
When using the [koa-router] allowedMethods middleware, the response errors are not caught by the error logger and are instead logged as successful requests. In most applications this is fine, but in the instance that you want these failures to be logged as errors you need to log these as errors follow the instructions [here⇗](docs/koa-router-allowedMethods-fix.md).

# Test
## NPM
```
npm test
```
## YARN
```
yarn test
```

# License
Licensed under [MIT](./LICENSE).

<!-- Links --->
[koa]: https://github.com/koajs/koa
[pino]: https://github.com/pinojs/pino
[koa-pino-logger]: https://github.com/pinojs/koa-pino-logger
[koa-router]: https://github.com/alexmingoia/koa-router