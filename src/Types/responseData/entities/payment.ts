import { MaybePopulated, PaymentOrderOperation, PaymentState } from '../..';
import { AuthorizationEntity } from './authorization';
import { CancellationEntity } from './cancellation';
import { CaptureEntity } from './capture';
import { MetadataEntity } from './metadata';
import { PayeeInfoEntity } from './payeeInfo';
import { PayerEntity } from './payer';
import { PriceEntity } from './price';
import { ReversalEntity } from './reversal';
import { TransactionEntity } from './transaction';
import { URLsEntity } from './URLs';

export interface PaymentEntity {
  readonly id: string;
  readonly number: number;
  readonly created: string;
  readonly updated: string;
  readonly instrument: string;
  readonly state: PaymentState;
  readonly operation?: PaymentOrderOperation;
  readonly currency: string;
  readonly amount: number;
  readonly vatAmount?: number;
  readonly remainingCaptureAmount?: number;
  readonly remainingReversalAmount?: number;
  readonly remainingCancellationAmount?: number;
  readonly description: string;
  readonly payerReference?: string;
  readonly initiatingSystemUserAgent: string;
  readonly userAgent: string;
  readonly language: string;
  readonly recurrenceToken?: string;
  readonly paymentToken?: string;
  readonly prices?: MaybePopulated<{
    priceList: PriceEntity[];
  }>;
  readonly transactions?: MaybePopulated<{
    transactionList: TransactionEntity[];
  }>;
  readonly authorizations?: MaybePopulated<{
    authorizationList: AuthorizationEntity[];
  }>;
  readonly captures?: MaybePopulated<{ captureList: CaptureEntity[] }>;
  readonly reversals?: MaybePopulated<{
    reversalList: ReversalEntity[];
  }>;
  readonly cancellations?: MaybePopulated<{
    cancellationList: CancellationEntity[];
  }>;
  readonly urls?: MaybePopulated<URLsEntity>;
  readonly payeeInfo: MaybePopulated<PayeeInfoEntity>;
  readonly payers?: MaybePopulated<PayerEntity>;
  readonly metadata?: MaybePopulated<MetadataEntity>;
}
