import { TransactionEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Transaction = AsPaymentSubResponse<{
  readonly transaction: TransactionEntity;
}>;

export type TransactionList = AsPaymentSubResponse<{
  transactions: {
    transactionList: ReadonlyArray<TransactionEntity>;
  };
}>;
