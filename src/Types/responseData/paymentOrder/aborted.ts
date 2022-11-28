import { AbortedEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Aborted = AsPaymentOrderSubResponse<{
  aborted: AbortedEntity;
}>;
