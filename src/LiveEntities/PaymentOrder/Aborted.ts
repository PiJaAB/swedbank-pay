import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'aborted';

export default class Aborted extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.AbortedResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the abort reason, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getAbortReason(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ abortReason }) => abortReason ?? null,
    );
  }
}
