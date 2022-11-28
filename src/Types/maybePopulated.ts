type Base = {
  /**
   * The relative URL and unique identifier of the resource.
   * Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution.
   */
  id: string;
};

type Unpopulated<T> = {
  [key in keyof T]?: never;
};

type Populated<T> = {
  [key in keyof T]: T[key] extends object ? Readonly<T[key]> : T[key];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaybePopulated<T> = T extends { id: any }
  ?
      | {
          readonly [key in keyof Populated<T>]: Populated<T>[key];
        }
      | {
          readonly [key in keyof (Pick<T, 'id'> &
            Unpopulated<Omit<T, 'id'>>)]: (Pick<T, 'id'> &
            Unpopulated<Omit<T, 'id'>>)[key];
        }
  :
      | {
          readonly [key in keyof (Base & Populated<T>)]: (Base &
            Populated<T>)[key];
        }
      | {
          readonly [key in keyof (Base & Unpopulated<T>)]: (Base &
            Unpopulated<T>)[key];
        };

export default MaybePopulated;
