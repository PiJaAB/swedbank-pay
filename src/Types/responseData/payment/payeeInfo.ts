import { PayeeInfoEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type PayeeInfo = AsPaymentSubResponse<{
  payeeInfo: PayeeInfoEntity;
}>;
