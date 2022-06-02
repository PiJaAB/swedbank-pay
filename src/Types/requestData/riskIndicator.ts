/** This optional object consist of information that helps verifying the payer. Providing these fields decreases the likelihood of having to prompt for 3-D Secure 2.0 authentication of the payer when they are authenticating the purchase. */
export default interface RiskIndicator {
  /**
   * For electronic delivery, the email address to which the merchandise was delivered.
   * Providing this field when appropriate decreases the likelihood of a 3-D Secure authentication for the payer.
   */
  readonly deliveryEmailAdress?: string;
  /**
   * Indicates the merchandise delivery timeframe.
   * - `01` Electronic Delivery
   * - `02` Same day shipping
   * - `03` Overnight shipping
   * - `04` Two-day or more shipping
   */
  readonly deliveryTimeFrameIndicator?: '01' | '02' | '03' | '04';
  /**
   * For a pre-ordered purchase. The expected date that the merchandise will be available. Format: `YYYYMMDD`
   */
  readonly preOrderDate?: string;
  /**
   * Indicates whether the payer is placing an order for merchandise with a future availability or release date.
   * - `01` Merchandise available
   * - `02` Future availability
   */
  readonly preOrderPurchaseIndicator?: '01' | '02';
  /** Indicates shipping method chosen for the transaction.
   *- `01` Ship to cardholder’s billing address
   *- `02` Ship to another verified address on file with merchant
   *- `03` Ship to address that is different than cardholder’s billing address
   *- `04` Ship to Store / Pick-up at local store. Store address shall be populated in shipping address fields
   *- `05` Digital goods, includes online services, electronic giftcards and redemption codes
   *- `06` Travel and Event tickets, not shipped
   *- `07` Other, e.g. gaming, digital service
   */
  readonly shipIndicator?: '01' | '02' | '03' | '04' | '05' | '06' | '07';
  /**
   * `true` if this is a purchase of a gift card.
   */
  readonly giftCardPurchase?: boolean;
  /**
   * Indicates whether the cardholder is reordering previously purchased merchandise.
   * - `01` First time ordered
   * - `02` Reordered
   */
  readonly reOrderPurchaseIndicator?: '01' | '02';
  /** If `shipIndicator` set to `04`, then prefill this with the payers `pickUpAddress` of the purchase to decrease the risk factor of the purchase. */
  readonly ckUpAddress?: {
    /** If `shipIndicator` set to `04`, then prefill this with the payers `name` of the purchase to decrease the risk factor of the purchase. */
    readonly name?: string;
    /**
     * If `shipIndicator` set to `04`, then prefill this with the payers `streetAddress` of the purchase to decrease the risk factor of the purchase.
     * @maxlen 50
     */
    readonly streetAddress?: string;
    /** If `shipIndicator` set to `04`, then prefill this with the payers `coAddress` of the purchase to decrease the risk factor of the purchase. */
    readonly coAddress?: string;
    /** If `shipIndicator` set to `04`, then prefill this with the payers `city` of the purchase to decrease the risk factor of the purchase. */
    readonly city?: string;
    /** If `shipIndicator` set to `04`, then prefill this with the payers zipCode of the purchase to decrease the risk factor of the purchase. */
    readonly zipCode?: string;
    /** If `shipIndicator` set to `04`, then prefill this with the payers countryCode of the purchase to decrease the risk factor of the purchase. */
    readonly countryCode?: string;
  };
}
