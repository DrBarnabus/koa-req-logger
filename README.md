# Introduction
A simple logging middleware for the [koa](https://github.com/koajs/koa) http middleware framework for nodejs. This module uses the [pino](https://github.com/pinojs/pino) logger and was inspired by the [koa-pino-logger](https://github.com/pinojs/koa-pino-logger) module.

As well as logging requests, this module also sets the HTTP Headers Date, X-Response-Time and X-Request-ID.

- The *X-Request-ID* HTTP Header is either set to a new uuid or the value of the X-Request-ID passed in the request so that requests can be tracked through multiple services.
- The *Date* HTTP Header is set to the date that the request was recieved with the API.
- The *X-Response-Time* HTTP Header is set as the response time in milliseconds.

# Install
TODO: Create install instructions.

# Usage Example
```js
const KoaLogger = require('@drbarnabus/koa-logger');
const Koa = require('koa');

const logger = new KoaLogger(); // Can also take an options parameter.

const app = new Koa();

app.use(logger.middleware);

app.use((ctx) => {
  ctx.body = 'Hello World!';
});

app.listen(3000);
```

# Caveats
## koa-router allowedMethods()
When using the [koa-router](https://github.com/alexmingoia/koa-router) allowedMethods middleware, the response errors are not caught by the error logger and are instead logged as successful requests. In most applications this is fine, but in the instance that you want these failures to be logged as errors a small change needs to be made to the middleware function details [here⇗](docs/koa-router-allowedMethods-fix.md).

# Test
TODO: Write tests and document how to run them.

# Aknowledgements
TODO: Add aknowledgements if required or remove this section.

# Licence
Licenced under [MIT](./license).