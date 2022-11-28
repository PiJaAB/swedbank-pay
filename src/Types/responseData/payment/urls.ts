import { URLsEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type URLs = AsPaymentSubResponse<{
  urls: URLsEntity;
}>;
