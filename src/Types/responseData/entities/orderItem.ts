import { IntTypeMap } from '../..';

export type OrderItemType =
  | 'PRODUCT'
  | 'SERVICE'
  | 'SHIPPING_FEE'
  | 'DISCOUNT'
  | 'VALUE_CODE'
  | 'OTHER';

export interface OrderItemEntity<IntType extends keyof IntTypeMap> {
  reference: string;
  name: string;
  type: OrderItemType;
  class: string;
  quantity: IntTypeMap[IntType];
  quantityUnit: string;
  unitPrice: IntTypeMap[IntType];
  discountPrice: IntTypeMap[IntType];
  vatPercent: IntTypeMap[IntType];
  amount: IntTypeMap[IntType];
  vatAmount: IntTypeMap[IntType];
}
