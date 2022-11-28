import { PayerEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Payer = AsPaymentOrderSubResponse<{
  payer: PayerEntity;
}>;
