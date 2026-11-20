/**
 * Returns a shallow copy of `source` containing only keys listed in `allowedKeys`
 * whose values are not `undefined`.
 */
export function pickFields<T extends Record<string, any>>(
  source: Record<string, any>,
  allowedKeys: readonly (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key as string] !== undefined) {
      result[key] = source[key as string];
    }
  }
  return result;
}
