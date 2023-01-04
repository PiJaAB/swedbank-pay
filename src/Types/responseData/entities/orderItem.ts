export type OrderItemType =
  | 'PRODUCT'
  | 'SERVICE'
  | 'SHIPPING_FEE'
  | 'DISCOUNT'
  | 'VALUE_CODE'
  | 'OTHER';

export interface OrderItemEntity {
  reference: string;
  name: string;
  type: OrderItemType;
  class: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  discountPrice: number;
  vatPercent: number;
  amount: number;
  vatAmount: number;
}
