import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentEntity } from './paymentEntity';

const ENTITY_KEY = 'aborted';

export default class Aborted extends PaymentEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.Aborted
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the abort reason, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getAbortReason(
    forceFresh?: boolean,
  ): Promise<ResponseEntity.AbortedEntity['abortReason'] | null> {
    return this.getAll(forceFresh).then(
      ({ abortReason }) => abortReason ?? null,
    );
  }
}
