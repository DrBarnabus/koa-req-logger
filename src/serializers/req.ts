const reqProto = Object.create(
  {},
  {
    headers: {
      enumerable: true,
      value: {},
      writable: true
    },
    id: {
      enumerable: true,
      value: '',
      writable: true
    },
    ip: {
      enumerable: true,
      value: '',
      writable: true
    },
    method: {
      enumerable: true,
      value: '',
      writable: true
    },
    url: {
      enumerable: true,
      value: '',
      writable: true
    }
  }
);

export function reqSerializer(req: any) {
  const sReq = Object.create(reqProto);

  sReq.id = req.id;
  sReq.method = req.method;
  sReq.url = req.url;
  sReq.headers = req.headers;
  sReq.ip = req.ip;

  return sReq;
}
