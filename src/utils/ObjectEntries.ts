/* eslint-disable @typescript-eslint/no-explicit-any */
type EntryUnionToObjIntersection<
  T extends readonly [string | symbol | number, unknown],
> = (
  (T extends any ? (t: T) => T : never) extends infer U
    ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
      ? V
      : never
    : never
) extends (_: any) => infer W
  ? EntryUnionToObjIntersection<Exclude<T, W>> & {
      [key in (W & any[])[0]]: (W & any[])[1];
    }
  : unknown;

/**
 * Returns an object created by key-value entries for properties and methods
 * (Wrapper for Object.fromEntries which maintains typing information)
 * @param entries An iterable object that contains key-value entries for properties and methods.
 */
export function ObjectFromEntries<
  T extends readonly (readonly [string | number | symbol, unknown])[],
>(
  entries: T,
): {
  [key in keyof EntryUnionToObjIntersection<
    T[number]
  >]?: EntryUnionToObjIntersection<T[number]>[key];
} {
  return Object.fromEntries<T[number][1]>(entries) as any;
}

/**
 * An array of entries from {@link ObjectEntries}
 */
export type Entries<T> = {
  [key in keyof T & string]: [key, T[key]];
}[keyof T & string][];

/**
 * Returns an array of key/values of the enumerable properties of an object
 * (Wrapper for Object.entries which maintains typing information)
 * @param o Object that contains the properties and methods.
 */
export function ObjectEntries<T extends object>(o: T): Entries<T> {
  return Object.entries(o) as Entries<T>;
}
