export { default as Payer } from './payer';
import PaymentOrder from './paymentOrder';
import RiskIndicator from './riskIndicator';
import OrderItem from './orderItem';

export interface Purchase {
  /** The payment order object. */
  readonly paymentorder: PaymentOrder;
  /**
   * The array of items being purchased with the order. Note that authorization orderItems will not be printed on invoices, so lines meant for print must be added in the Capture request.
   * The authorization orderItems will, however, be used in the Admin system when captures or reversals are performed, and might be shown other places later.
   * It is required to use this field to be able to send Capture orderItems. Capture requests should only contain items meant to be captured from the order.
   */
  readonly orderItems: ReadonlyArray<OrderItem>;
  /**
   * This **optional** object consist of information that helps verifying the payer. Providing these fields decreases the likelihood of having to prompt for 3-D Secure 2.0 authentication of the payer when they are authenticating the purchase.
   */
  readonly riskIndicator?: RiskIndicator;
}

export { PaymentOrder, RiskIndicator, OrderItem };
