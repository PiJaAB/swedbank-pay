import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderResponse } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'payeeInfo';

export default class PayeeInfo extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  PaymentOrderResponse.PayeeInfo
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * This is the unique id that identifies this payee (like merchant) set by Swedbank Pay
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getPayeeId(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ payeeId }) => payeeId ?? null);
  }

  /**
   * The payee name (like merchant name) that will be displayed when redirected to Swedbank Pay.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getPayeeName(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ payeeName }) => payeeName ?? null);
  }

  /**
   * A unique reference from the merchant system.
   * It is set per operation to ensure an exactly-once delivery of a transactional operation.
   * See [`payeeReference`](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/payee-reference) for details.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getPayeeReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ payeeReference }) => payeeReference ?? null,
    );
  }

  /**
   * A product category or number sent in from the payee/merchant.
   * It is passed through the payment process and may be used in the settlement process.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getProductCategory(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ productCategory }) => productCategory ?? null,
    );
  }

  /**
   * The order reference should reflect the order reference found in the merchant’s systems.
   * Fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from the backend before resolving
   */
  getOrderReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ orderReference }) => orderReference ?? null,
    );
  }
}
