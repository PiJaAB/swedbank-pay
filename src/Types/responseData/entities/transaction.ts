import { OperationEntity } from './operation';

export interface TransactionEntity {
  /** The relative URL and unique identifier of the `transaction` resource . Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution. */
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
    | 'Sale'
    | 'Verification';
  /**
   * Indicates the state of the transaction, usually `Initialized`, `Completed` or `Failed`.
   * If a partial transaction has been done and further transactionsare possible, the state will be `AwaitingActivity`.
   */
  readonly state: 'Initialized' | 'Completed' | 'Failed' | 'AwaitingActivity';
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
  /** A 40 character length textual [description](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/description) of the purchase. */
  readonly description: string;
  /**
   * A unique reference from the merchant system. Set per operation to ensure an exactly-once delivery of a transactional operation. Length and content validation depends on
   * whether the `transaction.number` or the `payeeReference` is sent to the acquirer. **If Swedbank Pay handles the settlement,** the `transaction.number` is sent and the `payeeReference`
   * must be in the format of `A-Za-z0-9` (including `-`) and `string(30)`. **If you handle the settlement,** Swedbank Pay will send the `payeeReference` and it will be limited to the
   * format of `string(12)`. All characters **must be digits**. In Invoice Payments `payeeReference` is used as an invoice/receipt number, if the `receiptReference` is not defined.
   */
  readonly payeeReference: string;
  /** `true` if the transaction is operational; otherwise `false`. */
  readonly isOperational: boolean;
  /**
   * The array of [`operations`](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/operations) that are possible to perform on the transaction in its current state.
   */
  readonly operations: OperationEntity[];
}
