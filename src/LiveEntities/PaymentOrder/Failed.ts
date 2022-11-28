import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'failed';

export default class Failed extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.Failed
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }
  /**
   * Get an object describing the problem related to the failure.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getProblem(
    forceFresh?: boolean,
  ): Promise<ResponseEntity.FailedProblemEntity | null> {
    return this.getAll(forceFresh).then(({ problem }) => problem ?? null);
  }
}
