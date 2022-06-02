import { MaybePopulated } from '..';

export interface AbortedResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly aborted: MaybePopulated<{
    readonly abortReason: 'CancelledByConsumer' | 'CancelledByCustomer';
  }>;
}
