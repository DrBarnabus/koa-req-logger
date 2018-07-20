'use strict';

const request = require('supertest');
const Koa = require('koa');
const KoaReqLogger = require('../');

describe('middleware', () => {
  // test('Should return a function', () => {
  //   expect(typeof KoaReqLogger()).toBe('function');
  // });

  test('Response should include HTTP Date header', async done => {
    // Setup
    const app = new Koa();
    const logger = new KoaReqLogger();
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
    const logger = new KoaReqLogger();
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
    const logger = new KoaReqLogger();
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
    const logger = new KoaReqLogger();
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
      }
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
});
