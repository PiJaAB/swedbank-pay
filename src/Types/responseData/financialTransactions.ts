import { MaybePopulated } from '..';

export interface FinancialTransactionListEntry {
  /** The id of the financial transaction. */
  readonly id: string;
  /** The ISO-8601 date of when the payment order was created. */
  readonly created: string;
  /** The ISO-8601 date of when the payment order was updated. */
  readonly updated: string;
  /** The type of transaction. `Capture`, `Authorization`, `Cancellation`, `Reversal`, `Sale`. */
  readonly type:
    | 'Capture'
    | 'Authorization'
    | 'Cancellation'
    | 'Reversal'
    | 'Sale';
  /**
   * The transaction number, useful when there’s need to reference the transaction in human communication.
   * Not usable for programmatic identification of the transaction, where id should be used instead.
   */
  readonly number: number;
  /**
   readonly * The transaction amount (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   */
  readonly amount: number;
  /**
   * The payment’s VAT (Value Added Tax) `amount`, entered in the lowest monetary unit of the selected currency.
   readonly * E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * The `vatAmount` entered will not affect the `amount` shown on the payment page, which only shows the total `amount`.
   * This field is used to specify how much of the total amount the VAT will be. Set to `0` (zero) if there is no VAT `amount` charged.
   */
  readonly vatAmount: number;
  /** The description of the payment order. */
  readonly description: string;
  /**
   * A unique reference from the merchant system.
   * It is set per operation to ensure an exactly-once delivery of a transactional operation.
   * See [`payeeReference`](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/payee-reference) for details.
   */
  readonly payeeReference: string;
  /** A unique reference from the merchant system. It is used to supplement `payeeReference` as an additional receipt number. */
  readonly receiptReference: string;
  /**
   * The array of items being purchased with the order.
   * Note that authorization orderItems will not be printed on invoices, so lines meant for print must be added in the Capture request.
   * The authorization `orderItems` will, however, be used in the Admin system when captures or reversals are performed, and might be shown other places later.
   * It is required to use this field to be able to send Capture `orderItems`. `Capture` requests should only contain items meant to be captured from the order.
   */
  readonly orderItems: {
    readonly id: string;
  };
}

export interface FinancialTransactionsResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  /** The financial transactions object. */
  readonly financialTransactions: MaybePopulated<{
    /** The array of financial transactions. */
    readonly financialTransactionsList: ReadonlyArray<FinancialTransactionListEntry>;
  }>;
}
