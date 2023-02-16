import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'history';

export default class History extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.HistoryResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the history list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getHistoryList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.HistoryListEntry>> {
    return this.getAll(forceFresh).then(({ historyList }) => historyList ?? []);
  }
}
