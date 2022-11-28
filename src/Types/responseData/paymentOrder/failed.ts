import { FailedEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Failed = AsPaymentOrderSubResponse<{
  failed: FailedEntity;
}>;
