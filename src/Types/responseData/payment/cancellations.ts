import { CancellationEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Cancellation = AsPaymentSubResponse<{
  readonly cancellation: CancellationEntity;
}>;

export type CancellationList = AsPaymentSubResponse<{
  readonly cancellations: {
    readonly cancellationList: ReadonlyArray<CancellationEntity>;
  };
}>;
