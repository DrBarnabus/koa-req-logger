
export function errSerializer(err: any) {
  const obj: any = {
    message: err.message,
    stack: err.stack,
    type: err.constructor.name
  };

  for (const key in err) {
    if (obj[key] === undefined) {
      obj[key] = err[key];
    }
  }

  return obj;
}
