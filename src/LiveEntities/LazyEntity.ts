import SwedbankPayClient from '../SwedbankPayClient';
import { MaybePopulated } from '../Types';

export default abstract class LazyEntity<
  Key extends string | number | symbol,
  ResData extends { [key in Key]?: { id: string } },
> {
  private readonly _key: Key;
  private _id: string;
  private _inFlight: Promise<ResData> | null = null;
  readonly client: SwedbankPayClient;
  private _lastFetched: number | undefined = undefined;
  private _response: MaybePopulated<ResData[Key]> | undefined;

  constructor(client: SwedbankPayClient, key: Key, id: string) {
    this._id = id;
    this._key = key;
    this.client = client;
  }

  protected onData?(res: ResData): void;

  protected getFresh(force?: boolean) {
    if (force || this._inFlight == null) {
      const promise = this.client.axios
        .get<ResData>(this._id)
        .then((res) => {
          if (this._inFlight === promise) {
            this._id = res.data[this._key]?.id ?? this._id;
            this._lastFetched = Date.now();
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

  get id() {
    return this._id;
  }

  get lastFetched(): Date | undefined {
    if (this._lastFetched == null) return undefined;
    return new Date(this._lastFetched);
  }

  /**
   * Get the full response from the object.
   * Fetches from Swedbank Pay if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getAll(forceFresh?: boolean): Promise<MaybePopulated<ResData[Key]>> {
    if (!forceFresh && this._response != null) {
      return Promise.resolve(this._response);
    }
    return this.getFresh(forceFresh).then(
      ({ [this._key]: response }) =>
        response ?? ({ id: this._id } as MaybePopulated<ResData[Key]>),
    );
  }
}
