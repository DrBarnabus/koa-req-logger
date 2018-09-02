
const resProto = Object.create({}, {
  headers: {
    enumerable: true,
    value: {},
    writable: true
  },
  status: {
    enumerable: true,
    value: 0,
    writable: true
  }
});

export function resSerializer(res: any) {
  const sRes = Object.create(resProto);

  sRes.status = res.status;
  sRes.headers = res.headers;

  return sRes;
}
