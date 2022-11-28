/** Possible event names that can occurr in the [historyList](../interfaces/Types.responseData.HistoryResponse.html#history) */
export enum HistoryEvent {
  /** This event will occur as soon as the merchant initiates the payment order. */
  PaymentCreated = 'PaymentCreated',
  /** Will be set when checkin is started, if checkin is activated for the merchant. The merchant must be configured with ProductPackage=Checkout */
  CheckinInitiated = 'CheckinInitiated',
  /** Will be set if a consumer profile is found. The merchant must be configured with ProductPackage=Checkout */
  PayerDetailsRetrieved = 'PayerDetailsRetrieved',
  /** Will be set when checkin is completed. The merchant must be configured with ProductPackage=Checkout */
  PayerCheckedIn = 'PayerCheckedIn',
  /**
   * If the `PaymentOrder` is initiated in InstrumentMode, the first occurrence will be set to the value from the merchant´s POST statement.
   * Following values will be set for each time the merchant to a PATCH to change the instrument used for that payment.
   * The instrument set will be in the instrument parameter.
   */
  PaymentInstrumentSet = 'PaymentInstrumentSet',
  /** Will be set the first time the payer loads the payment window. If this event hasn’t occurred, the payment window hasn’t been loaded. */
  PaymentLoaded = 'PaymentLoaded',
  /** Will occur each time the payer expands an instrument in the payment menu. The instrument selected will be set in the instrument parameter. */
  PaymentInstrumentSelected = 'PaymentInstrumentSelected',
  /**
   * Will occur when the payer presses the first button in the payment process (either “pay” or “next” if the payment has multiple steps).
   * The instrument parameter will contain the instrument for this attempt.
   * The prefill will be true if the payment page was prefilled with payment information.
   * The transaction number for this payment will be available in the number field.
   */
  PaymentAttemptStarted = 'PaymentAttemptStarted',
  /** Will occur if the payer aborts the payment attempt. Both the number and instrument parameters will be available on this event. */
  PaymentAttemptAborted = 'PaymentAttemptAborted',
  /** Will occur if the payment failed. Both the number and instrument parameters will be available on this event. */
  PaymentAttemptFailed = 'PaymentAttemptFailed',
  /** Will occur if the payment succeeds. Both the number and instrument parameters will be available on this event. */
  PaymentPaid = 'PaymentPaid',
  /**
   * Will occur when the merchant has captured the full authorization amount. Both the number and instrument parameters will be available on this event.
   * The number of this event will point to a number in the `financialTransaction` node for easy linking.
   */
  PaymentCaptured = 'PaymentCaptured',
  /**
   * Will occur when the merchant has done a partial capture of authorization amount. Both the number and instrument parameters will be available on this event.
   * The number of this event will point to a number in the `financialTransaction` node for easy linking.
   */
  PaymentPartialCaptured = 'PaymentPartialCaptured',
  /** Will occur when the merchant has cancelled the full authorization amount. Both the number and instrument parameters will be available on this event. */
  PaymentCancelled = 'PaymentCancelled',
  /** Will occur when the merchant has cancelled part of the authorization amount. Both the number and instrument parameters will be available on this event. */
  PaymentPartialCancelled = 'PaymentPartialCancelled',
  /**
   * Will occur when the merchant reverses the full authorization amount. Both the number and instrument parameters will be available on this event.
   * The number of this event will point to a number in the `financialTransaction` node for easy linking.
   */
  PaymentReversed = 'PaymentReversed',
  /**
   * Will occur when the merchant reverses a part of the authorization amount. Both the number and instrument parameters will be available on this event.
   * The number of this event will point to a number in the `financialTransaction` node for easy linking.
   */
  PaymentPartialReversed = 'PaymentPartialReversed',
}

export interface HistoryEntity {
  /** The ISO-8601 date of when the history event was created. */
  readonly created: string;
  /** Name of the history event. See enum documentation for more information. */
  readonly name: HistoryEvent;
  /** The payment instrument used when the event occurred. */
  readonly instrument?: string;
  /** Payment number associated with the event. */
  readonly number?: number;
  /** Indicates if payment info was prefilled or not. */
  readonly prefill?: boolean;
  /** `Consumer`, `Merchant` or `Systemś. The party that initiated the event. */
  readonly initiatedBy: 'Consumer' | 'Merchant' | 'System';
}
