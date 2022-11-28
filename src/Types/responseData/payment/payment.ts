import { OperationEntity, PaymentEntity } from '../entities';

export interface Payment {
  readonly payment: PaymentEntity;
  readonly operations: ReadonlyArray<OperationEntity>;
}
