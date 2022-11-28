export interface FailedProblemEntity {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly problems: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
}

export interface FailedEntity {
  problem: FailedProblemEntity;
}
