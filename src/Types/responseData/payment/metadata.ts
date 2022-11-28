import { MetadataEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Metadata = AsPaymentSubResponse<{
  metadata: MetadataEntity;
}>;
