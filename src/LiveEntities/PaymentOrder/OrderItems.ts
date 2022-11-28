import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse, ResponseEntity } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'orderItems';

export default class OrderItems extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.OrderItems
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the order item list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getOrderItemList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<ResponseEntity.OrderItemEntity>> {
    return this.getAll(forceFresh).then(
      ({ orderItemList }) => orderItemList ?? [],
    );
  }
}
