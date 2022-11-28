export interface OperationEntity {
  readonly method: 'GET' | 'PATCH' | 'POST';
  readonly href: string;
  readonly rel: string;
  readonly contentType?: string;
}
