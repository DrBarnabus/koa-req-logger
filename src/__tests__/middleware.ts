import Koa from 'koa';
import { Context, Middleware } from 'koa';
import pino from 'pino';
import request from 'supertest';
import { KoaReqLogger } from '../';

describe('Middleware', () => {
  test('getMiddleware() should return a function', () => {
    const logger = new KoaReqLogger();
    expect(typeof logger.getMiddleware()).toEqual('function');
  });

  test('Response should include HTTP Date header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx: Context, next: Middleware) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.header.date).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Response should include HTTP X-Response-Time header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx: any, next: any) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.header['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Response should include HTTP X-Request-ID header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.header['x-request-id']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test(`When a X-Request-ID is provided in the request,
    the same value should be sent back as the HTTP X-Request-ID header`, async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server)
      .get('/')
      .set('X-Request-ID', 'test-value');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.header['x-request-id']).toBeDefined();
    expect(response.header['x-request-id']).toEqual('test-value');

    // Teardown
    server.close();
    done();
  });

  test('Should use custom uuid function if provided, and return the correct value', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      },
      uuidFunction: () => {
        return 'test-uuid';
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx: any, next: any) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.header['x-request-id']).toBeDefined();
    expect(response.header['x-request-id']).toEqual('test-uuid');

    // Teardown
    server.close();
    done();
  });

  test('Should return the correct HTTP Status Code if an error is thrown', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      // Simulate an error being thrown
      ctx.throw(400, 'Bad Request');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');

    // Teardown
    server.close();
    done();
  });

  test('Should return an error object if an error is thrown in a request handler', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      // Simulate an error being thrown
      ctx.throw(500, 'Internal Server Error');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(500);
    expect(response.type).toEqual('application/json');
    expect(response.body.error).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should return an error object, with the correct error code if an error is thrown', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      // Simulate an error being thrown
      ctx.throw(400, 'Bad Request');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.error.code).toBeDefined();
    expect(response.body.error.code).toEqual(400);

    // Teardown
    server.close();
    done();
  });

  test('Should return an error object, with the correct error message if an error is thrown', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      // Simulate an error being thrown
      ctx.throw(400, 'Bad Request');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.error.message).toBeDefined();
    expect(response.body.error.message).toEqual('Bad Request');

    // Teardown
    server.close();
    done();
  });

  test('Should not return the rest of the response body on error', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      // Simulate an error being thrown
      ctx.throw(400, 'Bad Request');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the X-Request-ID HTTP Header if disabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableIdHeader: true,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-request-id']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the Date HTTP Header if disabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableDateHeader: true,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header.date).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the X-Response-Time HTTP Header if disabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableResponseTimeHeader: true,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-response-time']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should not ignore the X-Request-ID HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableIdHeader: false,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-request-id']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should not ignore the Date HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableDateHeader: false,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header.date).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should not ignore the X-Response-Time HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableResponseTimeHeader: false,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should respond with no headers, if all are disabled', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      disableDateHeader: true,
      disableIdHeader: true,
      disableResponseTimeHeader: true,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-request-id']).toBeUndefined();
    expect(response.header.date).toBeUndefined();
    expect(response.header['x-response-time']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should respond with all headers, if all are enabled', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.header['x-request-id']).toBeDefined();
    expect(response.header.date).toBeDefined();
    expect(response.header['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should still respond correctly with alwaysError option set', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      alwaysError: true,
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      ctx.throw(400, 'Bad Request');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');

    // Teardown
    server.close();
    done();
  });

  test('Should respond with status 500 if a generic error is thrown', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoOptions: {
        enabled: false
      }
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };

      throw new Error('Generic Error with no Status');
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(500);
    expect(response.body.error.code).toEqual(500);
    expect(response.body.error.message).toEqual('Internal Server Error');
    expect(response.type).toEqual('application/json');

    // Teardown
    server.close();
    done();
  });

  test('Should work correctly when a pino instance is passed in.', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      pinoInstance: pino({ enabled: false })
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    const server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.header.date).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should work correctly when extreme mode is enabled', async done => {
    try {
      const logger = new KoaReqLogger({
        extreme: true
      });

      done();
    } catch (e) {
      // Make the test fail as no error should be thrown.
      expect(true).toBeFalsy();
      done();
    }
  });

  test('Should throw an error if pinoInstance and pinoOptions are passed in at the same time.', async done => {
    try {
      const logger = new KoaReqLogger({
        pinoInstance: pino({ enabled: false }),
        pinoOptions: {
          enabled: false
        }
      });

      // Fail the test as it should throw an error.
      expect(false).toBeTruthy();
      done();
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });

  test('Should throw an error if pinoInstance and extreme are passed in at the same time.', async done => {
    try {
      const logger = new KoaReqLogger({
        extreme: false,
        pinoInstance: pino({ enabled: false })
      });

      // Fail the test as it should throw an error.
      expect(false).toBeTruthy();
      done();
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });
});
