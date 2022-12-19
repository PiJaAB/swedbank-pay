/* eslint-disable @typescript-eslint/no-namespace */
export namespace Payment {
  export type Authorization = import('./authorization').Authorization;
  export type AuthorizationList = import('./authorization').AuthorizationList;
  export type Cancellation = import('./cancellations').Cancellation;
  export type CancellationList = import('./cancellations').CancellationList;
  export type Capture = import('./captures').Capture;
  export type CaptureList = import('./captures').CaptureList;
  export type Metadata = import('./metadata').Metadata;
  export type Payers = import('./payers').Payers;
  export type PayeeInfo = import('./payeeInfo').PayeeInfo;
  export type PriceList = import('./prices').PriceList;
  export type Reversat = import('./reversals').Reversal;
  export type ReversalList = import('./reversals').ReversalList;
  export type Transaction = import('./transactions').Transaction;
  export type TransactionList = import('./transactions').TransactionList;
  export type URLs = import('./urls').URLs;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Payment = import('./payment').Payment;
export default Payment;
