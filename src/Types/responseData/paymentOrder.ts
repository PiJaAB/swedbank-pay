import type { PaymentOrderOperation } from '..';

export interface PaymentOrderResponseData {
  readonly id: string;
  readonly created: string;
  readonly updated: string;
  readonly operation: PaymentOrderOperation;
  readonly status:
    | 'Initialized'
    | 'Ready'
    | 'Pending'
    | 'Failed'
    | 'Aborted'
    | 'Paid';
  readonly currency: string;
  readonly amount: number;
  readonly vatAmount: number;
  readonly remainingCaptureAmount?: number;
  readonly remainingReversalAmount?: number;
  readonly remainingCancellationAmount?: number;
  readonly description: string;
  readonly initiatingSystemUserAgent: string;
  readonly language: string;
  readonly recurrenceToken?: string;
  readonly paymentToken?: string;
  readonly availableInstruments: string[];
  readonly implementation: string;
  readonly integration: string;
  readonly instrumentMode: boolean;
  readonly guestMode: boolean;
  readonly orderItems: {
    readonly id: string;
  };
  readonly urls: {
    readonly id: string;
  };
  readonly payeeInfo: {
    readonly id: string;
  };
  readonly payer?: {
    readonly id: string;
  };
  readonly history: {
    readonly id: string;
  };
  readonly failed: {
    readonly id: string;
  };
  readonly aborted: {
    readonly id: string;
  };
  readonly paid: {
    readonly id: string;
  };
  readonly cancelled: {
    readonly id: string;
  };
  readonly financialTransactions: {
    readonly id: string;
  };
  readonly failedAttempts: {
    readonly id: string;
  };
  readonly metadata: {
    readonly id: string;
  };
}
export interface PaymentOrderOperationEntity {
  readonly method: 'GET' | 'PATCH' | 'POST';
  readonly href: string;
  readonly rel:
    | 'update-order'
    | 'abort'
    | 'cancel'
    | 'capture'
    | 'reversal'
    | 'redirect-checkout'
    | 'view-checkout';
  readonly contentType: string;
}
export interface PaymentOrderResponse {
  readonly paymentOrder: PaymentOrderResponseData;
  readonly operations: ReadonlyArray<PaymentOrderOperationEntity>;
}
