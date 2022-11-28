import { TransactionEntity } from './transaction';

export interface CancellationEntity {
  /** The relative URL and unique identifier of the `cancellation` resource . Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution. */
  id: string;
  /** The transaction object, containing information about the current transaction. */
  transaction: TransactionEntity;
}
