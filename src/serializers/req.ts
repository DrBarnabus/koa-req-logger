let reqProto = Object.create(
  {},
  {
    id: {
      enumerable: true,
      writable: true,
      value: ''
    },
    method: {
      enumerable: true,
      writable: true,
      value: ''
    },
    url: {
      enumerable: true,
      writable: true,
      value: ''
    },
    headers: {
      enumerable: true,
      writable: true,
      value: {}
    },
    ip: {
      enumerable: true,
      writable: true,
      value: ''
    }
  }
);

export function reqSerializer(req: any) {
  const _req = Object.create(reqProto);

  _req.id = req.id;
  _req.method = req.method;
  _req.url = req.url;
  _req.headers = req.headers;
  _req.ip = req.ip;

  return _req;
}
