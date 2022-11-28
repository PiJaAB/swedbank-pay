import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'failedAttempts';

export default class FailedAttempts extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.FailedAttempts
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the failed attempts list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getFailedAttemptsList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<ResponseEntity.FailedAttemptEntity>> {
    return this.getAll(forceFresh).then(
      ({ failedAttemptList }) => failedAttemptList ?? [],
    );
  }
}
