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
   * Get the financial transactions list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getOrderItemList(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.OrderItemListEntry>> {
    return this.getAll(forceFresh).then(
      ({ orderItemList }) => orderItemList ?? [],
    );
  }
}
