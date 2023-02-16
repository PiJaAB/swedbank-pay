import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'orderItems';

export default class OrderItems extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.OrderItemsResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the order item list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getOrderItemList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.OrderItemListEntry>> {
    return this.getAll(forceFresh).then(
      ({ orderItemList }) => orderItemList ?? [],
    );
  }
}
