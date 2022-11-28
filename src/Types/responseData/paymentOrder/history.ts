import { HistoryEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type History = AsPaymentOrderSubResponse<{
  history: {
    historyList: ReadonlyArray<HistoryEntity>;
  };
}>;
