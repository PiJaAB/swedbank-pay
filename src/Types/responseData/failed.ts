import { MaybePopulated } from '..';

export interface FailedProblemResponse {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly problems: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
}

export interface FailedResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly failed: MaybePopulated<{
    readonly problem: FailedProblemResponse;
  }>;
}
