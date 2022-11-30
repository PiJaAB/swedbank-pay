export * as responseData from './responseData';
export * as requestData from './requestData';

export type OrderItemType =
  | 'PRODUCT'
  | 'SERVICE'
  | 'SHIPPING_FEE'
  | 'PAYMENT_FEE'
  | 'DISCOUNT'
  | 'VALUE_CODE'
  | 'OTHER';

export type InvoicePaymentInstrument =
  | 'Invoice'
  | 'Invoice-PayExFinancingNo'
  | 'Invoice-PayExFinancingSe'
  | 'Invoice-PayMonthlyInvoiceSe';

export type PaymentInstrument =
  | 'CreditCard'
  | 'Vipps'
  | 'Swish'
  | 'Trustly'
  | 'CreditAccount'
  | 'MobilePay'
  | InvoicePaymentInstrument;

export type PaymentOrderOperation = 'Purchase' | 'Recur' | 'Abort' | 'Verify';

export { default as MaybePopulated } from './maybePopulated';

export type RecursivePartial<T> = T extends Array<infer Q>
  ? RecursivePartial<Q>[]
  : T extends object
  ? {
      [key in keyof T]?: RecursivePartial<T[key]>;
    }
  : T;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type RecursiveMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? RecursiveMutable<T[P]> : T[P];
};
