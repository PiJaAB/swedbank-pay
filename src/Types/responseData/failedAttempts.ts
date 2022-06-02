import { FailedProblemResponse } from './failed';
import { MaybePopulated } from '..';

export interface FailedAttemptListEntry {
  readonly created: string;
  readonly instrument: string;
  readonly number: number;
  readonly status: 'Failed' | 'Aborted';
  readonly problem: FailedProblemResponse;
}

export interface FailedAttemptsResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  readonly failedAttempts: MaybePopulated<{
    readonly failedAttemptList: ReadonlyArray<FailedAttemptListEntry>;
  }>;
}
