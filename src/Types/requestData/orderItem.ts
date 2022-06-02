import type { OrderItemType, PaymentInstrument } from '..';

/**
 * An item entry being purchased with the order. Note that authorization orderItems will not be printed on invoices, so lines meant for print must be added in the Capture request.
 * The authorization `orderItems` will, however, be used in the Admin system when captures or reversals are performed, and might be shown other places later.
 * It is required to use this field to be able to send Capture `orderItems`. `Capture` requests should only contain items meant to be captured from the order.
 */
export default interface OrderItem {
  /** A reference that identifies the order item. */
  readonly reference: string;
  /** The name of the order item. */
  readonly name: string;
  /** The type of the order item. `PAYMENT_FEE` is the amount you are charged with when you are paying with invoice. The amount can be defined in the `amount` field below. */
  readonly type: OrderItemType;
  /** The classification of the order item. Can be used for assigning the order item to a specific product category, such as `MobilePhone`. Note that `class` cannot contain spaces and must follow the regex pattern `[\w-]*`. Swedbank Pay may use this field for statistics. */
  readonly class: string;
  /** The URL to a page that can display the purchased item, product or similar. */
  readonly itemUrl?: string;
  /** The URL to an image of the order item. */
  readonly imageUrl?: string;
  /**
   * A 40 character length textual [description](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/description) of the purchase.
   * @maxlen 40
   */
  readonly description?: string;
  /** The human readable description of the possible discount. */
  readonly discountDescription?: string;
  /**
   * The 4 decimal precision quantity of order items being purchased.
   * @integer
   */
  readonly quantity: number;
  /** The unit of the quantity, such as `pcs`, `grams`, or similar. This is used for your own book keeping. */
  readonly quantityUnit: string;
  /**
   * The price per unit of order item, including VAT.
   * @integer
   */
  readonly unitPrice: number;
  /**
   * If the order item is purchased at a discounted price. This field should contain that price, including VAT.
   * @integer
   */
  readonly discountPrice?: number;
  /**
   * The percent value of the VAT multiplied by 100, so `25%` becomes `2500`.
   * @integer
   */
  readonly vatPercent: number;
  /**
   * The transaction amount (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * @integer
   */
  readonly amount: number;
  /**
   * The payment’s VAT (Value Added Tax) `amount`, entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * The `vatAmount` entered will not affect the `amount` shown on the payment page, which only shows the total `amount`.
   * This field is used to specify how much of the total `amount` the VAT will be. Set to 0 (zero) if there is no VAT `amount` charged.
   * @integer
   */
  readonly vatAmount: number;
  /**
   * `CreditCard`, `Invoice`, `Vipps`, `Swish`, `Trustly` and/or `CreditAccount`. Invoice supports the subtypes `PayExFinancingNo`, `PayExFinancingSe` and `PayMonthlyInvoiceSe`, separated by a dash, e.g.; `Invoice-PayExFinancingNo`.
   * Default value is all supported payment instruments. Use of this field requires an agreement with Swedbank Pay.
   * You can restrict fees and/or discounts to certain instruments by adding this field to the orderline you want to restrict. Use positive amounts to add fees, and negative amounts to add discounts.
   */
  readonly restrictedToInstruments?: ReadonlyArray<PaymentInstrument>;
}
