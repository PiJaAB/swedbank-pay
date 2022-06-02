import { MaybePopulated } from '..';

export interface OrderItemListEntry {
  reference: string;
  name: string;
  type: 'PRODUCT';
  class: string;
  quantity: number;
  quantityUnit: 'pcs';
  unitPrice: 1000;
  discountPrice: 0;
  vatPercent: 2500;
  amount: 1000;
  vatAmount: 200;
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
