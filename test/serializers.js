'use strict';

const reqSerializer = require('../lib/req');
const resSerializer = require('../lib/res');
const errSerializer = require('../lib/err');

describe('Serializers', () => {
  describe('reqSerializer', () => {
    test('Should serialize a standard req object', () => {
      const req = {
        id: 'id',
        method: 'method',
        url: '/url',
        headers: ['headers', 'array'],
        ip: '127.0.0.1'
      };

      const serialized = reqSerializer(req);

      expect(serialized).toEqual(req);
    });
    test('Should serialize a non-standard req object, and remove all unwanted members', () => {
      const req = {
        id: 'id',
        method: 'method',
        url: '/url',
        headers: ['headers', 'array'],
        ip: '127.0.0.1',
        nonStandard: 'method'
      };

      const serialized = reqSerializer(req);

      expect(serialized.nonStandard).toBeUndefined();
      expect(serialized.ip).toBeDefined();
      expect(serialized.ip).toEqual('127.0.0.1');
    });
  });

  describe('resSerializer', () => {
    test('Should serialize a standard res object', () => {
      const res = {
        status: 200,
        headers: ['header', 'array']
      };

      const serialized = resSerializer(res);

      expect(serialized).toEqual(res);
    });

    test('Should serialize a non-standard res object, and remove all unwanted members', () => {
      const res = {
        status: 200,
        headers: ['header', 'array'],
        nonStandard: 'member'
      };

      const serialized = resSerializer(res);

      expect(serialized.nonStandard).toBeUndefined();
      expect(serialized.status).toBeDefined();
      expect(serialized.status).toEqual(200);
    });
  });

  describe('errSerializer', () => {
    test('Should serialize a standard err object', () => {
      const err = {
        type: 'Error Name',
        message: 'Error Message',
        stack: 'Error Stack'
      };
      
      const serialized = errSerializer(err);

      expect(serialized.message).toEqual(err.message);
      expect(serialized.stack).toEqual(err.stack);
    });

    test('Should serialize a non-standard err object, retaining all non-standard members', () => {
      const err = {
        type: 'Error Name',
        message: 'Error Message',
        stack: 'Error Stack',
        nonStandard: 'member'
      };

      const serialized = errSerializer(err);

      expect(serialized.nonStandard).toBeDefined();
      expect(serialized.nonStandard).toEqual('member');
    });
  });
});
