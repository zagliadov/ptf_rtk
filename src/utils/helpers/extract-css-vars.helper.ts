export function extractCSSVars<T>(
  data: Record<string, string>,
  handler: (a: string) => T,
): Readonly<{
  [p: string]: T;
}> {
  const obj: {
      [key: string]: T;
  } = {};

  const keys = Object.keys(data);

  keys.forEach((key: string) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
          obj[key] = handler(data[key]!);
      }
  });

  return Object.freeze(obj);
}