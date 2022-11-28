import { FailedProblemEntity } from './failed';

export interface FailedAttemptEntity {
  readonly created: string;
  readonly instrument: string;
  readonly number: number;
  readonly status: 'Failed' | 'Aborted';
  readonly problem: FailedProblemEntity;
}
