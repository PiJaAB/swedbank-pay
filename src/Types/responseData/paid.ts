import { MaybePopulated } from '..';

export interface PaidTokenResponse {
  readonly type: 'payment' | 'recurrence' | 'transactionOnfile' | 'unscheduled';
  readonly token: string;
  readonly name: string;
  readonly expiryDate: string;
}

export interface PaidResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly paid: MaybePopulated<{
    readonly instrument: string;
    readonly number: number;
    readonly payeeReference: string;
    readonly orderReference?: string;
    readonly amount: number;
    readonly tokens?: ReadonlyArray<PaidTokenResponse>;
    readonly details?: {
      readonly nonPaymentToken?: string;
      readonly externalNonPaymentToken?: string;
    };
  }>;
}
