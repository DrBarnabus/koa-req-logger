const pino = require('pino');
const uuidv4 = require('uuid/v4');

const stdSerializers = {
  req: require('./lib/req'),
  res: require('./lib/res'),
  err: require('./lib/err')
};

module.exports = class KoaReqLogger {
  /**
   * A logging middleware for koa, this middleware also sets the HTTP Date header,
   * sets the X-Response-Time header to the response time in milliseconds and sets the
   * X-Request-ID header to either a new uuidv4 or the request id passed into the request
   * @example
   * ``` javascript
   * const app = Koa();
   * const logger = KoaReqLogger();
   * app.use(logger.getMiddleware());
   * app.listen(3000);
   * ```
   * @param {object} opts An optional options object
   * @api public
   */
  constructor(opts) {
    this.middleware = this.middleware.bind(this);

    opts = opts || {};
    opts.serializers = opts.serializers || {};
    opts.serializers.req = opts.serializers.req || stdSerializers.req;
    opts.serializers.res = opts.serializers.res || stdSerializers.res;
    opts.serializers.err = opts.serializers.err || stdSerializers.err;

    this.logger = pino(opts);
  }

  /**
   * This function takes a request context and assigns a request id
   * This will either be a newly generated uuidv4 or the X-Request-ID header passed into the request
   * The resulting request id is then set as the X-Request-ID header on the response
   * @param ctx The current koa response context
   * @api private
   */
  setRequestId(ctx) {
    if (ctx.get('X-Request-ID')) {
      ctx.id = ctx.get('X-Request-ID');
      ctx.set('X-Request-ID', ctx.id);
    } else {
      ctx.id = uuidv4();
      ctx.set('X-Request-ID', ctx.id);
    }
  }

  /**
   * This function sets the current date as the date header,
   * as well as logging the request and storing the start date for the calculation of the response time later
   * @param ctx The current koa context
   * @api private
   */
  startRequest(ctx) {
    ctx.start = new Date();
    ctx.set('Date', ctx.start.toUTCString());

    ctx.log.info({ req: ctx.req, startDate: ctx.start.toUTCString() }, `${ctx.request.ip} - ${ctx.method} ${ctx.path}`);
  }

  /**
   * This function calcuates the response time and sets the X-Response-Time header
   * @param ctx The current koa context
   * @api private
   */
  setResponseTime(ctx) {
    let now = new Date();
    ctx.responseTime = now - ctx.start;
    ctx.set('X-Response-Time', `${ctx.responseTime}ms`);
  }

  /**
   * This function logs the end of a request,
   * it also calls another function to calculate and set the X-Response-Time header
   * @param ctx The current koa context
   * @api private
   */
  endRequest(ctx) {
    this.setResponseTime(ctx);

    ctx.log.info(
      { res: ctx.response, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
      `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
    );
  }

  /**
   * This function logs the end of a request and the error that has been caught,
   * it also calls another function to calculate and set the X-Response-Time header
   * @param ctx The current koa context
   * @api private
   */
  endRequestError(e, ctx) {
    this.setResponseTime(ctx);

    // Construct error response
    ctx.status = e.status;
    ctx.body = {
      error: {
        code: e.status,
        message: e.message
      }
    };

    ctx.log.error(
      { res: ctx.response, err: e, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
      `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
    );
  }

  /**
   * This function handles all requests and is used as a koa middleware
   * @param ctx The current koa context
   * @param next The next function in the middleware stack
   * @api private
   */
  async middleware(ctx, next) {
    // Set the request id
    this.setRequestId(ctx);

    // Create a child of the logger with the request id as the key
    ctx.log = ctx.logger = ctx.req.log = ctx.request.log = ctx.response.log = this.logger.child({ id: ctx.id });

    // Start the request logging
    this.startRequest(ctx);

    try {
      await next();

      // End the request logging
      this.endRequest(ctx);
    } catch (e) {
      // Handle error and end request logging
      this.endRequestError(e, ctx);
    }
  }

  getMiddleware() {
    return this.middleware;
  }
};
