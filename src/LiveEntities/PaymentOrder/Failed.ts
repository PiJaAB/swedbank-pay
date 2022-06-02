import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'failed';

export default class Failed extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.FailedResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }
  /**
   * Get the history list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getProblem(
    forceFresh?: boolean,
  ): Promise<responseData.FailedProblemResponse | null> {
    return this.getAll(forceFresh).then(({ problem }) => problem ?? null);
  }
}
