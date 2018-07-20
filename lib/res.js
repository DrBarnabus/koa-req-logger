
let resProto = Object.create({}, {
  status: {
    enumerable: true,
    writable: true,
    value: 0
  },
  headers: {
    enumerable: true,
    writable: true,
    value: {}
  }
});

function resSerializer(res) {
  const _res = Object.create(resProto);

  _res.status = res.status;
  _res.headers = res.headers;

  return _res;
}

module.exports = resSerializer;
