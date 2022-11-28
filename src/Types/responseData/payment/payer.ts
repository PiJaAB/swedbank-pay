import { PayerEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Payer = AsPaymentSubResponse<{
  payer: PayerEntity;
}>;
