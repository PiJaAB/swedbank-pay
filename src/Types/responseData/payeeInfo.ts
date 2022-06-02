import { MaybePopulated } from '..';

export interface PayeeInfoResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly payeeInfo: MaybePopulated<{
    readonly payeeId: string;
    readonly payeeReference: string;
    readonly payeeName: string;
    readonly productCategory?: string;
    readonly orderReference?: string;
  }>;
}
