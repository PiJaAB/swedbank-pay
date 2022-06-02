import { MaybePopulated } from '..';

export interface CancelledTokenResponse {
  readonly type: 'payment' | 'recurrence' | 'transactionOnfile' | 'unscheduled';
  readonly token: string;
  readonly name: string;
  readonly expiryDate: string;
}

export interface CancelledResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly cancelled: MaybePopulated<{
    readonly cancelReason: string;
    readonly instrument: string;
    readonly number: number;
    readonly payeeReference: string;
    readonly orderReference?: string;
    readonly amount: number;
    readonly tokens?: ReadonlyArray<CancelledTokenResponse>;
    readonly details?: {
      readonly nonPaymentToken?: string;
      readonly externalNonPaymentToken?: string;
    };
  }>;
}
