import MaybePopulated from '../../maybePopulated';

export default interface PaymentSubResponse {
  /** The parent payment id. */
  readonly payment?: string;
}

type ToPaymentSubResponse<E> = PaymentSubResponse & {
  [key in keyof E]: MaybePopulated<E[key]>;
};

export type AsPaymentSubResponse<E> = {
  readonly [key in keyof ToPaymentSubResponse<E>]: ToPaymentSubResponse<E>[key];
};
