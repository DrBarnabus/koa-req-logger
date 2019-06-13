import { Context } from 'koa';
import pino from 'pino';
import uuidv4 from 'uuid/v4';
import { errSerializer, reqSerializer, resSerializer } from './serializers';

export { errSerializer, reqSerializer, resSerializer } from './serializers';

declare module 'koa' {
  interface Context {
    id: string;
    start: Date;
    log: pino.Logger;
    responseTime: number;
  }
}

// Workaround for extreme function as it doesn't currently exist in @types/pino
declare module 'pino' {
  function extreme(): any;
}

interface Error {
  status: number;
  message: string;
}

/** Function Signature for the optional Request ID Generation Function override. */
export type RequestIdFunction = () => string;

/** A set of configuration options used to configure a new instance of KoaReqLogger. */
export interface KoaReqLoggerOptions {
  /** When set to true, this option will force the log severity to be error for all non 2** response statuses. */
  alwaysError?: boolean;

  /**
   * Allows you to override the default request id generation function.
   * By default this is set to the uuidv4 function from the uuid node module.
   */
  uuidFunction?: RequestIdFunction;

  /** If set to true, this option will stop the X-Request-ID header being added to responses. */
  disableIdHeader?: boolean;

  /** If set to true, this option will stop the Date header being added to responses. */
  disableDateHeader?: boolean;

  /** If set to true, this option will stop the X-Response-Time header being added to responses. */
  disableResponseTimeHeader?: boolean;

  /**
   * These options will be passed to pino.
   * If no serializers for req, res or err are specified the defaults will be used.
   */
  pinoOptions?: pino.LoggerOptions;

  /** Configures pino the use extreme mode for added performance. */
  extreme?: boolean;

  /**
   * Allows you to pass your own instance of Pino preconfigured to use in the logging middleware.
   * This option is not compatible with pinoOptions or extreme,
   * as they don't make sense if you pass a preconfigured pino object.
   * If a preconfigured instance is used requests, responses and errors will not be serialized.
   */
  pinoInstance?: pino.Logger;
}

export class KoaReqLogger {
  /** Set to true if the X-Request-ID header should be included in responses. */
  private idHeader: boolean;

  /** Set to true if the Date header should be included in responses. */
  private startHeader: boolean;

  /** Set to true if the X-Response-Time header should be included in responses. */
  private responseTimeHeader: boolean;

  /** The function used to generate the ids used in the X-Request-ID header. */
  private uuidFunction: RequestIdFunction;

  /** If set to true, the error severity will be used for all non 2xx status responses. */
  private alwaysError: boolean;

  /** The pino logger instance used internaly by the module. */
  private logger: pino.Logger;

  /**
   * Create a new instance of KoaReqLogger to use in a Koa App.
   * @param options - KoaReqLoggerOptions to configure the middleware.
   * @param options.alwaysError - When set to true, the log severity will be error for all non 2xx status responses.
   * @param options.uuidFunction - Allows you to override the default X-Request-ID generation function.
   * @param options.disableIdHeader - If set to true, the X-Request-ID header is not included in responses.
   * @param options.disableDateHeader - If set to true, the Date header is not included in responses.
   * @param options.disableResponseTimeHeader - If set to true, the X-Response-Time header is not included in responses.
   * @param options.pinoOptions - This object will be passed to pino to configure the logger instance.
   * @param options.extreme - If set to true, the extreme mode of pino will be used for extra performance.
   * @param options.pinoInstance - Pass in your own preconfigured instance of the pino logger.
   */
  constructor(options?: KoaReqLoggerOptions) {
    this.middleware = this.middleware.bind(this);

    const opts: KoaReqLoggerOptions = options || {};

    if (opts.pinoInstance && opts.pinoOptions) {
      throw new Error('Pino Options cannot be used with a Pino Instance. Only 1 can be used at a time.');
    }

    if (opts.pinoInstance && opts.extreme !== undefined) {
      throw new Error(`Extreme cannot be used with a Pino Instance.
        Configure extreme mode on the pino instance before passing into koa-req-logger.`);
    }

    if (opts.pinoInstance) {
      this.logger = opts.pinoInstance;
    } else {
      opts.pinoOptions = opts.pinoOptions || {};

      // Set standard serializers, if no custom ones used
      opts.pinoOptions.serializers = opts.pinoOptions.serializers || {};
      opts.pinoOptions.serializers.req = opts.pinoOptions.serializers.req || reqSerializer;
      opts.pinoOptions.serializers.res = opts.pinoOptions.serializers.res || resSerializer;
      opts.pinoOptions.serializers.err = opts.pinoOptions.serializers.err || errSerializer;

      if (opts.extreme) {
        this.logger = pino(opts.pinoOptions, pino.extreme());
      } else {
        this.logger = pino(opts.pinoOptions);
      }
    }

    // Check if X-Request-ID header has been disabled
    if (opts.disableIdHeader == true) {
      this.idHeader = false;
    } else {
      this.idHeader = true;
    }

    // Check if Date header has been disabled
    if (opts.disableDateHeader == true) {
      this.startHeader = false;
    } else {
      this.startHeader = true;
    }

    // Check if X-Response-Time header has been disabled
    if (opts.disableResponseTimeHeader == true) {
      this.responseTimeHeader = false;
    } else {
      this.responseTimeHeader = true;
    }

    // Check if a uuidFunction has been passed in options and use if available
    if (typeof opts.uuidFunction === 'function') {
      this.uuidFunction = opts.uuidFunction;
      delete opts.uuidFunction;
    } else {
      this.uuidFunction = uuidv4;
    }

    delete opts.uuidFunction;

    this.alwaysError = opts.alwaysError || false;

    delete opts.alwaysError;
  }

  /**
   * This function returns the middleware function for use in koa.
   */
  public getMiddleware() {
    return this.middleware;
  }

  /**
   * This function takes a request context and assigns a request id.
   * This will either be a newly generated uuidv4 or the X-Request-ID header passed into the request.
   * The resulting request id is then set as the X-Request-ID header on the response.
   * @param ctx - The current koa response context.
   */
  private setRequestId(ctx: Context) {
    if (ctx.get('X-Request-ID')) {
      ctx.id = ctx.get('X-Request-ID');
    } else {
      ctx.id = this.uuidFunction();
    }

    if (this.idHeader) {
      ctx.set('X-Request-ID', ctx.id);
    }
  }

  /**
   * This function sets the current date as the date header,
   * as well as logging the request and storing the start date for the calculation of the response time later.
   * @param ctx - The current koa context.
   */
  private startRequest(ctx: Context) {
    ctx.start = ctx[Symbol.for('request-received.startTime')] ? ctx[Symbol.for('request-received.startTime')] : new Date();

    if (this.startHeader) {
      ctx.set('Date', ctx.start.toUTCString());
    } else {
      ctx.remove('Date'); // Remove default header set by koa
    }

    ctx.log.info({ req: ctx.req, startDate: ctx.start.toUTCString() }, `${ctx.request.ip} - ${ctx.method} ${ctx.path}`);
  }

  /**
   * This function calcuates the response time and sets the X-Response-Time header.
   * @param ctx - The current koa context.
   */
  private setResponseTime(ctx: Context) {
    const now: Date = new Date();
    ctx.responseTime = now.getTime() - ctx.start.getTime();

    if (this.responseTimeHeader) {
      ctx.set('X-Response-Time', `${ctx.responseTime}ms`);
    }
  }

  /**
   * This function logs the end of a request,
   * it also calls another function to calculate and set the X-Response-Time header.
   * @param ctx - The current koa context.
   */
  private endRequest(ctx: Context) {
    this.setResponseTime(ctx);

    ctx.log.info(
      { res: ctx.response, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
      `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
    );
  }

  /**
   * This function logs the end of a request and the error that has been caught,
   * it also calls another function to calculate and set the X-Response-Time header.
   * @param ctx - The current koa context.
   */
  private endRequestError(e: Error, ctx: Context) {
    this.setResponseTime(ctx);

    // Construct error response
    if (e.status !== undefined) {
      ctx.status = e.status;
      ctx.body = {
        error: {
          code: e.status,
          message: e.message
        }
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: {
          code: 500,
          message: 'Internal Server Error'
        }
      };
    }

    // tslint:disable-next-line:no-bitwise
    if (((ctx.status / 100) | 0) == 5 || this.alwaysError) {
      ctx.log.error(
        { res: ctx.response, err: e, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
        `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
      );
    } else {
      ctx.log.warn(
        { res: ctx.response, err: e, responseTime: ctx.responseTime, startDate: ctx.start.toUTCString() },
        `${ctx.ip} - ${ctx.method} ${ctx.path} - ${ctx.status} ${ctx.responseTime}ms`
      );
    }
  }

  /**
   * This function handles all requests and is used as a koa middleware.
   * @param ctx - The current koa context.
   * @param next - The next function in the middleware stack.
   */
  private async middleware(ctx: Context, next: any) {
    // Set the request id
    this.setRequestId(ctx);

    // Create a child of the logger with the request id as the key
    ctx.log = this.logger.child({ id: ctx.id });

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
}

export default KoaReqLogger;
