export type MaybePopulated<T> = {
  /**
   * The relative URL and unique identifier of the `paymentorder` resource.
   * Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution.
   */
  readonly id: string;
} & (
  | { readonly [key in keyof T]?: never }
  | { readonly [key in keyof T]: T[key] }
);

export default MaybePopulated;
