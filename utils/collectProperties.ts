/* eslint-disable @typescript-eslint/no-explicit-any */
export function collectProperties(
  obj: Record<string, any>,
  properties: string[]
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const prop of properties) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result[prop] = obj[prop];
    }
  }

  return result;
}
