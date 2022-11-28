export interface PaidTokenEntity {
  readonly type: 'payment' | 'recurrence' | 'transactionOnfile' | 'unscheduled';
  readonly token: string;
  readonly name: string;
  readonly expiryDate: string;
}

export interface PaidEntity {
  instrument: string;
  number: number;
  payeeReference: string;
  orderReference?: string;
  amount: number;
  tokens?: ReadonlyArray<PaidTokenEntity>;
  details?: {
    readonly nonPaymentToken?: string;
    readonly externalNonPaymentToken?: string;
  };
}
