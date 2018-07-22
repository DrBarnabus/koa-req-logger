# API Reference

* koa-req-logger
  * [KoaReqLogger](#KoaReqLogger)
    * [new KoaReqLogger([opts])](#new_koa-req-logger)
    * _instance_
      * [.getMiddleware()](#function_get-middleware)

## KoaReqLogger
**Kind**: Exported Class

<a name="new_koa-req-logger"></a>
### new KoaReqLogger([opts])
Creates a new instance of the KoaReqLogger with the provided options.

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | A configuration option, can take any options that would usually be passed to [pino]. |
| [opts].alwaysError | <code>Boolean</code> | Forces the logger to always use the error severity when an error is thrown regardless of response status. | <code>false</code> |
| [opts].uuidFunction | <code>Function</code> | Allows you to override the default uuid generation function for the request id. Function should return the uuid as a string. | uuidv4 from [uuid].
| [opts].headers | <code>Object\Boolean</code> | If set to false, or an empty object it will disable all headers being added to a request. Alternatively you can use the object to individually control the headers. |
| [opts].headers.id | <code>Boolean</code> | If set to false, it will disable the X-Request-ID Header. | <code>true</code> |
| [opts].headers.date | <code>Boolean</code> | If set to false, it will disable the Date Header. | <code>true</code> |
| [opts].headers.responseTime | <code>Boolean</code> | If set to false, it will disable the X-Response-Time Header. | <code>true</code> |

**Pino Options:**

By default serializers for the following objects are provided to pino; req, res and err. These can be overriden by providing your own pino compatible serializers in the options <code>[opts].serializers</code> and serailizers for other objects can be added without affecting the defaults.

The options object is then passed directly to pino, and you can see their documentation for options on their github page [here⇗].

**Example:**

```js
const logger = new KoaReqLogger({
  alwaysError: true,
  headers: {
    date: false
  },
  uuidFunction: () => {
    return 'uuid-as-string';
  },
  enabled: false // Enabled option will be passed to pino.
});
```

<a name="function_get-middleware"></a>
### logger.getMiddleware()
Returns the middleware to be used with koa.

**Example:**

```js
const app = new Koa();
const logger = new KoaReqLogger();

app.use(logger.getMiddleware());
```

[pino]: https://github.com/pinojs/pino
[uuid]: https://github.com/kelektiv/node-uuid
[here⇗]: https://github.com/pinojs/pino/blob/master/docs/API.md