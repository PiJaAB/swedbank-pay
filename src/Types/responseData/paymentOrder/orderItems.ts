import { OrderItemEntity } from '../entities';
import { AsPaymentOrderSubResponse } from './paymentOrderSubResponse';

export type OrderItems = AsPaymentOrderSubResponse<{
  orderItems: {
    orderItemList: ReadonlyArray<OrderItemEntity<'number'>>;
  };
}>;
