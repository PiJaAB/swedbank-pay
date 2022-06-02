import { MaybePopulated } from '..';

export interface UrlsResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  /** The urls object. */
  readonly urls: MaybePopulated<{
    /**
     * The URL that Swedbank Pay will redirect back to when the payer has completed his or her interactions with the payment.
     * This does not indicate a successful payment, only that it has reached a final (complete) state.
     * A `GET` request needs to be performed on the payment order to inspect it further. See [`completeUrl`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/complete-url) for details.
     */
    readonly completeUrl: string;
    /** The URL to redirect the payer to if the payment is cancelled, either by the payer or by the merchant trough an `abort` request of the `payment` or `paymentorder`. */
    readonly cancelUrl?: string;
    /** The URL to the API endpoint receiving `POST` requests on transaction activity related to the payment order. */
    readonly callbackUrl?: string;
    /** The URL to the terms of service document which the payer must accept in order to complete the payment. **HTTPS is a requirement. */
    readonly termsOfServiceUrl?: string;
    /** The URL that Swedbank Pay will redirect back to when the payment menu needs to be loaded, to inspect and act on the current status of the payment. See [`paymentUrl`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/payment-url) for details. */
    readonly paymentUrl?: string;
    /** The array of URLs valid for embedding of Swedbank Pay Hosted Views. */
    readonly hostUrls: ReadonlyArray<string>;
  }>;
}
