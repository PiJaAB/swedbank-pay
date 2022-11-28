export interface PayeeInfoEntity {
  /**
   * The relative URL and unique identifier of the `payeeInfo` resource.
   * Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution.
   */
  readonly id: string;
  readonly payeeId: string;
  readonly payeeReference: string;
  readonly payeeName: string;
  readonly productCategory?: string;
  readonly orderReference?: string;
}
