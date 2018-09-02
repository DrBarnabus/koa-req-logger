
export function errSerializer(err: any) {
  let obj: any = {
    type: err.constructor.name,
    message: err.message,
    stack: err.stack
  };

  for (let key in err) {
    if (obj[key] === undefined) {
      obj[key] = err[key];
    }
  }

  return obj;
};
