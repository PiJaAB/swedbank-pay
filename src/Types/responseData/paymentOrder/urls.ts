import { URLsEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type URLs = AsPaymentOrderSubResponse<{
  /** The URLs object. */
  readonly urls: URLsEntity;
}>;
