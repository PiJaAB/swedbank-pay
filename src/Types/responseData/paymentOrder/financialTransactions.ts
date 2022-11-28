import { FinancialTransactionEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type FinancialTransactions = AsPaymentOrderSubResponse<{
  financialTransactions: {
    financialTransactionList: ReadonlyArray<FinancialTransactionEntity>;
  };
}>;
