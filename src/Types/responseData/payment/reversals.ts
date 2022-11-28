import { ReversalEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Reversal = AsPaymentSubResponse<{
  reversal: ReversalEntity;
}>;

export type ReversalList = AsPaymentSubResponse<{
  reversals: {
    reversalList: ReadonlyArray<ReversalEntity>;
  };
}>;
