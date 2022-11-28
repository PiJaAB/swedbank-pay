import { PayeeInfoEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type PayeeInfo = AsPaymentOrderSubResponse<{
  payeeInfo: PayeeInfoEntity;
}>;
