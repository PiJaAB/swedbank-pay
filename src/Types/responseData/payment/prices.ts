import { PriceEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type PriceList = AsPaymentSubResponse<{
  prices: {
    priceList: ReadonlyArray<PriceEntity>;
  };
}>;
