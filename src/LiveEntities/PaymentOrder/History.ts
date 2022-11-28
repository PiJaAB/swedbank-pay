import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'history';

export default class History extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.History
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the history list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getHistoryList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<ResponseEntity.HistoryEntity>> {
    return this.getAll(forceFresh).then(({ historyList }) => historyList ?? []);
  }
}
