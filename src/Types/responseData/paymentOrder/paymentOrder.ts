import { OperationEntity, PaymentOrderEntity } from '../entities';

export interface PaymentOrder {
  readonly paymentOrder: PaymentOrderEntity;
  readonly operations: ReadonlyArray<OperationEntity>;
}
