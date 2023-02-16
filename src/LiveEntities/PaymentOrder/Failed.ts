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
   * Get an object describing the problem related to the failure.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getProblem(
    forceFresh?: boolean,
  ): Promise<responseData.FailedProblemResponse | null> {
    return this.getAll(forceFresh).then(({ problem }) => problem ?? null);
  }
}
