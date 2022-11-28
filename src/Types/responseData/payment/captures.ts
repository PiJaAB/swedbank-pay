import { CaptureEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Capture = AsPaymentSubResponse<{
  readonly capture: CaptureEntity;
}>;

export type CaptureList = AsPaymentSubResponse<{
  readonly captures: {
    readonly captureList: ReadonlyArray<CaptureEntity>;
  };
}>;
