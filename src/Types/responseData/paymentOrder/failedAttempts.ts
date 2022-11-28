import { FailedAttemptEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type FailedAttempts = AsPaymentOrderSubResponse<{
  failedAttempts: {
    failedAttemptList: ReadonlyArray<FailedAttemptEntity>;
  };
}>;
