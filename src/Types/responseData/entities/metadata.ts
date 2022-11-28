export interface MetadataEntity {
  /**
   * The relative URL and unique identifier of the `metadata` resource.
   * Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution.
   */
  readonly id: string;
  /** Key value pairs */
  readonly [key: string]: string | boolean | number | undefined;
}
