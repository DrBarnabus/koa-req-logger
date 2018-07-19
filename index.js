const pino = require('pino');
const uuidv4 = require('uuid/v4');

const serializers = {
  req: require('./lib/req'),
  res: require('./lib/res'),
  err: require('./lib/err')
};

module.exports = KoaLogger;

function KoaLogger(opts) {
  if (!(this instanceof KoaLogger)) {
    return new KoaLogger(opts);
  }

  this.opts = opts | {};
  this.opts.serializers = opts.serializers | serializers;

  this.logger = pino(opts);

  /**
   * This function takes a request context and assigns a request id
   * This will either be a newly generated uuidv4 or the X-Request-ID header passed into the request
   * The resulting request id is then set as the X-Request-ID header on the response
   * @param ctx The current koa response context
   */
  this.setReqId = function(ctx) {
    if (ctx.get('X-Request-ID')) {
      ctx.id = ctx.get('X-Request-ID');
      ctx.set('X-Request-ID', ctx.id);
    } else {
      ctx.id = uuidv4();
      ctx.set('X-Response-Time', ctx.id);
    }
  };

  /**
   * This function sets the current date as the date header,
   * as well as logging the request and storing the start date for the calculation of the response time later
   * @param ctx The current koa context
   */
  this.startRequest = function(ctx) {
    ctx.start = new Date();
    ctx.set('Date', ctx.start.toUTCString());

    ctx.log.info({ req: ctx.req, startDate: ctx.start.toUTCString() }, `${ctx.request.ip} - ${ctx.method} ${ctx.path}`);
  };

  /**
   * This function calcuates the response time and sets the X-Response-Time header
   * @param ctx The current koa context
   */
  this.setResponseTime = function(ctx) {
    let now = new Date();
    ctx.responseTime = now - ctx.start;
    ctx.set('X-Response-Time', `${ctx.responseTime}ms`);
  };

  /**
   * This function logs the end of a request,
   * it also calls another function to calculate and set the X-Response-Time header
   * @param ctx The current koa context
   */
  this.endRequest = function(ctx) {
    this.setResponseTime(ctx);

    ctx.log.info(
      { res: ctx.res, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
      `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
    );
  };

  this.endRequest = function(e, ctx) {
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
      { res: ctx.res, err: e, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
      `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
    );
  };
}

KoaLogger.prototype.middleware = async function middleware(ctx, next) {
  // Set the request id
  this.setReqId(ctx);

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
};
