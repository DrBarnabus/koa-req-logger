'use strict';

const request = require('supertest');
const Koa = require('koa');
const KoaReqLogger = require('../');

describe('middleware', () => {
  test('Response should include HTTP Date header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.headers['date']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Response should include HTTP X-Response-Time header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.headers['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Response should include HTTP X-Request-ID header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.headers['x-request-id']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('When a X-Request-ID is provided in the request, the same value should be sent back as the HTTP X-Request-ID header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server)
      .get('/')
      .set('X-Request-ID', 'test-value');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-request-id']).toEqual('test-value');

    // Teardown
    server.close();
    done();
  });

  test('Should use custom uuid function if provided, and return the correct value', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      uuidFunction: () => {
        return 'test-uuid';
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Hello World!');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-request-id']).toEqual('test-uuid');

    // Teardown
    server.close();
    done();
  });

  test('Should return the correct HTTP Status Code if an error is thrown', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      enabled: false
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

    let server = app.listen();

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
      enabled: false
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

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(400);
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
      enabled: false
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

    let server = app.listen();

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
      enabled: false
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

    let server = app.listen();

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
      enabled: false
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

    let server = app.listen();

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
      headers: {
        id: false
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-request-id']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the Date HTTP Header if disabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: {
        date: false
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['date']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the X-Response-Time HTTP Header if disabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: {
        responseTime: false
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-response-time']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the X-Request-ID HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: {
        id: true
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-request-id']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should ignore the Date HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: {
        date: true
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['date']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should add the X-Response-Time HTTP Header if enabled in the options', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: {
        responseTime: true
      },
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });

  test('Should respond with no headers, if all are disabled', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: false,
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-request-id']).toBeUndefined();
    expect(response.headers['date']).toBeUndefined();
    expect(response.headers['x-response-time']).toBeUndefined();

    // Teardown
    server.close();
    done();
  });

  test('Should respond with all headers, if all are enabled', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger({
      headers: true,
      enabled: false
    });
    app.use(logger.getMiddleware());

    app.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = {
        data: 'Hello World!'
      };
    });

    let server = app.listen();

    // Test
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['date']).toBeDefined();
    expect(response.headers['x-response-time']).toBeDefined();

    // Teardown
    server.close();
    done();
  });
});
