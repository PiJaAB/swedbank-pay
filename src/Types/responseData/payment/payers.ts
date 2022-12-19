import { PayerEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Payers = AsPaymentSubResponse<{
  payer: PayerEntity;
}>;
