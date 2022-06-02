import LazyEntity from '../LazyEntity';

export abstract class PaymentOrderEntity<
  Key extends string | number | symbol,
  ResData extends {
    [key in Key]: {
      id: string;
    };
  } & {
    readonly paymentorder?: string | null;
    readonly paymentOrder?: string | null;
  },
> extends LazyEntity<Key, ResData> {
  private _paymentOrderId: string | null | undefined = null;

  protected onData(res: ResData) {
    this._paymentOrderId = res.paymentOrder ?? res.paymentorder ?? null;
  }

  /**
   * Get the ID of the parent paymentOrder.
   * This will fetch the data from the backend if necessary.
   * note, paymentOrder is not always available in the response.
   * @returns A promise that resolves to the ID of the parent paymentOrder or null if not available.
   */
  getPaymentOrderId(): Promise<string | null> {
    if (typeof this._paymentOrderId !== 'undefined') {
      return Promise.resolve(this._paymentOrderId);
    }
    return this.getFresh().then(
      ({ paymentOrder, paymentorder }) => paymentOrder ?? paymentorder ?? null,
    );
  }
}
