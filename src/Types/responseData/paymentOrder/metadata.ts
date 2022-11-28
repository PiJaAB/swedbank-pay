import { MetadataEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type Metadata = AsPaymentOrderSubResponse<{
  metadata: MetadataEntity;
}>;
