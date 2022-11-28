import MaybePopulated from '../../maybePopulated';

export default interface PaymentOrderSubResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
}

type ToPaymentOrderSubResponse<E> = PaymentOrderSubResponse & {
  readonly [key in keyof E]: MaybePopulated<E[key]>;
};

export type AsPaymentOrderSubResponse<E> = {
  readonly [key in keyof ToPaymentOrderSubResponse<E>]: ToPaymentOrderSubResponse<E>[key];
};
