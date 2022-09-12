import { MaybePopulated } from '..';

export type OrderItemType =
  | 'PRODUCT'
  | 'SERVICE'
  | 'SHIPPING_FEE'
  | 'DISCOUNT'
  | 'VALUE_CODE'
  | 'OTHER';

export interface OrderItemListEntry {
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

export interface OrderItemsResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  /** The financial transactions object. */
  readonly orderItems: MaybePopulated<{
    /** The array of financial transactions. */
    readonly orderItemList: ReadonlyArray<OrderItemListEntry>;
  }>;
}
