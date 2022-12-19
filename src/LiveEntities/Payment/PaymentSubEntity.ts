import LazyEntity from '../LazyEntity';

export default class PaymentSubEntity<
  Key extends string | number | symbol,
  ResData extends {
    [key in Key]?: {
      id: string;
    };
  } & {
    readonly payment?: string | null;
  },
> extends LazyEntity<Key, ResData> {
  private _paymentId: string | null | undefined = null;

  protected onData(res: ResData) {
    this._paymentId = res.payment ?? res.payment ?? null;
  }

  /**
   * Get the ID of the parent paymentOrder.
   * This will fetch the data from the backend if necessary.
   * note, paymentOrder is not always available in the response.
   * @returns A promise that resolves to the ID of the parent paymentOrder or null if not available.
   */
  getPaymentId(): Promise<string | null> {
    if (typeof this._paymentId !== 'undefined') {
      return Promise.resolve(this._paymentId);
    }
    return this.getFresh().then(({ payment }) => payment ?? null);
  }
}
