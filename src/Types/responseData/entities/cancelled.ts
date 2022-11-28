export interface CancelledTokenEntity {
  readonly type: 'payment' | 'recurrence' | 'transactionOnfile' | 'unscheduled';
  readonly token: string;
  readonly name: string;
  readonly expiryDate: string;
}

export interface CancelledEntity {
  cancelReason: string;
  instrument: string;
  number: number;
  payeeReference: string;
  orderReference?: string;
  amount: number;
  tokens?: ReadonlyArray<CancelledTokenEntity>;
  details?: {
    readonly nonPaymentToken?: string;
    readonly externalNonPaymentToken?: string;
  };
}
