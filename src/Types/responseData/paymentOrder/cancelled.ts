import { CancelledEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Cancelled = AsPaymentOrderSubResponse<{
  cancelled: CancelledEntity;
}>;
