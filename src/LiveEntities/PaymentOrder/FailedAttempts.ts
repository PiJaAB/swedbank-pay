import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'failedAttempts';

export default class FailedAttempts extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.FailedAttemptsResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the failed attempts list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getFailedAttemptsList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.FailedAttemptListEntry>> {
    return this.getAll(forceFresh).then(
      ({ failedAttemptList }) => failedAttemptList ?? [],
    );
  }
}
