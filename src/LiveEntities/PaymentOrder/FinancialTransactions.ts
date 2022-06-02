import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'financialTransactions';

export default class FinancialTransactions extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.FinancialTransactionsResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the financial transactions list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getFinancialTransactionList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.FinancialTransactionListEntry>> {
    return this.getAll(forceFresh).then(
      ({ financialTransactionList }) => financialTransactionList ?? [],
    );
  }
}
