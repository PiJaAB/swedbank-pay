import { PaidEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Paid = AsPaymentOrderSubResponse<{
  paid: PaidEntity;
}>;
