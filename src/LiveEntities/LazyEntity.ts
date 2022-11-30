import SwedbankPayClient from '../SwedbankPayClient';
import { MaybePopulated } from '../Types';

export const resDataKey = Symbol('resData');

export default abstract class LazyEntity<
  Key extends string | number | symbol,
  ResData extends { [key in Key]?: MaybePopulated<unknown> },
> {
  readonly [resDataKey]: Key;
  readonly id: string;
  private _inFlight: Promise<ResData> | null = null;
  readonly client: SwedbankPayClient;
  readonly lastFetched: Date | undefined = undefined;
  private _response: ResData[Key] | undefined;

  constructor(client: SwedbankPayClient, key: Key, id: string) {
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
