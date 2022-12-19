import SwedbankPayClient from '../SwedbankPayClient';
import { IntTypeMap, MaybePopulated } from '../Types';

export const resDataKey = Symbol('resData');

type KeyOfAll<T> = T extends any ? keyof T : never;

type Unified<T> = {
  [Key in KeyOfAll<T>]: T extends any
    ? Key extends keyof T
      ? T[Key]
      : undefined
    : undefined;
};

export default abstract class LazyEntity<
  Key extends string | number | symbol,
  ResData extends { [key in Key]?: MaybePopulated<unknown> },
> {
  readonly [resDataKey]: Key;
  readonly id: string;
  private _inFlight: Promise<ResData> | null = null;
  readonly client: SwedbankPayClient<keyof IntTypeMap>;
  readonly lastFetched: Date | undefined = undefined;
  private _response: ResData[Key] | undefined;

  constructor(
    client: SwedbankPayClient<keyof IntTypeMap>,
    key: Key,
    id: string,
  ) {
    this.id = id;
    this[resDataKey] = key;
    this.client = client;
  }

  protected onData?(res: ResData): void;

  protected getFresh(force?: boolean) {
    if (force || this._inFlight == null) {
      const promise = this.client.axios
        .get<ResData>(this.id)
        .then((res) => {
          if (this._inFlight === promise) {
            Object.assign(this, {
              id: res.data[this[resDataKey]]?.id ?? this.id,
              lastFetched: new Date(),
            });
            if (this.onData != null) this.onData(res.data);
          }
          return res.data;
        })
        .finally(() => {
          if (this._inFlight === promise) {
            this._inFlight = null;
          }
        });
      this._inFlight = promise;
    }
    return this._inFlight;
  }

  async get<Keys extends [KeyOfAll<ResData[Key]>, ...KeyOfAll<ResData[Key]>[]]>(
    keys: Keys,
    forceFresh?: boolean,
  ): Promise<{
    [K in Keys[number]]-?: Unified<ResData[Key]>[K];
  }>;
  async get<K extends keyof Unified<ResData[Key]>>(
    key: K,
    forceFresh?: boolean,
  ): Promise<Unified<ResData[Key]>[K]>;
  async get(
    key:
      | KeyOfAll<ResData[Key]>
      | [KeyOfAll<ResData[Key]>, ...KeyOfAll<ResData[Key]>[]],
    forceFresh?: boolean,
  ) {
    const allValues = (await this.getAll(forceFresh)) as Unified<ResData[Key]>;
    if (key instanceof Array) {
      return Object.fromEntries(
        key.map((k) => [
          k,
          typeof allValues === 'object' && allValues != null
            ? k in allValues
              ? allValues[k as keyof typeof allValues]
              : undefined
            : undefined,
        ]),
      ) as {
        [key: string]:
          | Unified<ResData[Key]>[KeyOfAll<ResData[Key]> & string]
          | undefined;
        [key: number]:
          | Unified<ResData[Key]>[KeyOfAll<ResData[Key]> & number]
          | undefined;
        [key: symbol]:
          | Unified<ResData[Key]>[KeyOfAll<ResData[Key]> & symbol]
          | undefined;
      };
    }
    if (typeof allValues === 'object' && allValues != null) {
      const ret = allValues[key];
      return ret;
    }
    return undefined;
  }

  /**
   * Get the full response from the object.
   * Fetches from Swedbank Pay if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getAll(forceFresh?: boolean): Promise<ResData[Key]> {
    if (!forceFresh && this._response != null) {
      return Promise.resolve(this._response);
    }
    return this.getFresh(forceFresh).then(
      ({ [this[resDataKey]]: response }) =>
        response ?? ({ id: this.id } as ResData[Key]),
    );
  }
}
