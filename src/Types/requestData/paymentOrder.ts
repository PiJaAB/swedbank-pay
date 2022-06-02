import type { PaymentOrderOperation } from '..';
import Payer from './payer';

/** The payment order object. */
export default interface PaymentOrder {
  /** The operation that the payment order is supposed to perform. */
  readonly operation: PaymentOrderOperation;
  /** The currency of the payment. */
  readonly currency: string;
  /**
   * The transaction amount (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * @integer
   */
  readonly amount: number;
  /**
   * The payment’s VAT (Value Added Tax) `amount`, entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * The `vatAmount` entered will not affect the `amount` shown on the payment page, which only shows the total `amount`.
   * This field is used to specify how much of the total `amount` the VAT will be. Set to `0` (zero) if there is no VAT `amount` charged.
   * @integer
   */
  readonly vatAmount: number;
  /** The description of the payment order. */
  readonly description: string;
  /** The [user agent](https://developer.swedbankpay.com/introduction#user-agent) of the payer. Should typically be set to the value of the `User-Agent` header sent by the payer’s web browser. */
  readonly userAgent: string;
  /** The language of the payer. */
  readonly language: string;
  /** Used to tag the payment as Checkout v3. Mandatory for Checkout v3, as you won’t get the operations in the response without submitting this field. */
  readonly productName: 'Checkout3';
  /** Generate a payment token with the paymentOrder. Used for one-click payments in the future. */
  readonly generatePaymentToken?: boolean;
  /** Generate a recurrence token with the paymentOrder. Used for recurring payments, such as subscriptions. */
  readonly generateRecurrenceToken?: boolean;
  /** The `urls` object, containing the URLs relevant for the payment order. */
  readonly urls: {
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
  };
  /**
   * The `payeeInfo` object, containing information about the payee (the recipient of the money).
   * See [`payeeInfo`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/payee-info) for details.
   */
  readonly payeeInfo: {
    /** The ID of the payee, usually the merchant ID. */
    readonly payeeId: string;
    /**
     * A unique reference from the merchant system. It is set per operation to ensure an exactly-once delivery of a transactional operation.
     * See [`payeeReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/payee-reference) for details.
     * In Invoice Payments `payeeReference` is used as an invoice/receipt number, if the `receiptReference` is not defined.
     * @maxlen 30
     */
    readonly payeeReference: string;
    /** The name of the payee, usually the name of the merchant. */
    readonly payeeName?: string;
    /** A product category or number sent in from the payee/merchant. This is not validated by Swedbank Pay, but will be passed through the payment process and may be used in the settlement process. */
    readonly productCategory?: string;
    /**
     * The order reference should reflect the order reference found in the merchant’s systems.
     * @maxlen 50
     */
    readonly orderReference?: string;
    /**
     * The subsite field can be used to perform [split settlement](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation#split-settlement) on the payment.
     * The subsites must be resolved with Swedbank Pay [reconciliation](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation) before being used.
     * @maxlen 40
     */
    readonly subsite?: string;
  };
  /** The `payer` object containing information about the payer relevant for the payment order. */
  readonly payer?: Payer;
}
