import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'financialTransactions';

export default class FinancialTransactions extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.FinancialTransactions
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
  ): Promise<ReadonlyArray<ResponseEntity.FinancialTransactionEntity>> {
    return this.getAll(forceFresh).then(
      ({ financialTransactionList }) => financialTransactionList ?? [],
    );
  }
}
