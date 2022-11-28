/* eslint-disable @typescript-eslint/no-namespace */
export namespace PaymentOrder {
  export type Aborted = import('./aborted').Aborted;
  export type Cancelled = import('./cancelled').Cancelled;
  export type Failed = import('./failed').Failed;
  export type FailedAttempts = import('./failedAttempts').FailedAttempts;
  export type FinancialTransactions =
    import('./financialTransactions').FinancialTransactions;
  export type History = import('./history').History;
  export type Paid = import('./paid').Paid;
  export type URLs = import('./urls').URLs;
  export type Metadata = import('./metadata').Metadata;
  export type Payer = import('./payer').Payer;
  export type PayeeInfo = import('./payeeInfo').PayeeInfo;
  export type OrderItems = import('./orderItems').OrderItems;
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PaymentOrder = import('./paymentOrder').PaymentOrder;
export default PaymentOrder;
