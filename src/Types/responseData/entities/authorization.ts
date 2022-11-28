import { TransactionEntity } from './transaction';

export interface AuthorizationEntity {
  /** The relative URL and unique identifier of the `authorization` resource . Please read about [URL Usage](https://developer.swedbankpay.com/introduction#url-usage) to understand how this and other URLs should be used in your solution. */
  id: string;
  /** The type of the authorization. */
  direct: boolean | string;
  /** `Visa`, `MC`, etc. The brand of the card. */
  cardBrand: string;
  /** Credit Card or Debit Card. Indicates the type of card used for the authorization. */
  cardType: string;
  /** The name of the bank that issued the card used for the authorization. */
  issuingBank?: string;
  /** The payment token created for the card used in the authorization. */
  paymentToken?: string;
  /** The recurrence token created for the card used in the authorization. */
  recurrenceToken?: string;
  /** The masked PAN number of the card. */
  maskedPan: string;
  /** The month and year of when the card expires. (MM/YYYY) */
  expiryDate: string;
  /** The token representing the specific PAN of the card. */
  panToken: string;
  panEnrolled?: string | boolean;
  countryCode?: string;
  acquirerTransactionType?: string;
  issuerAuthorizationApprovalCode?: string;
  acquirerStan?: string;
  acquirerTerminalId?: string;
  /** The ISO-8601 date and time of the acquirer transaction. */
  acquirerTransactionTime?: string;
  /** The result of our own card tokenization. Activated in POS for the merchant or merchant group. */
  nonPaymentToken: string;
  /** The result of an external tokenization. This value will vary depending on card types, acquirers, customers, etc. For Mass Transit merchants, transactions redeemed by Visa will be populated with PAR. For Mastercard and Amex, it will be our own token. */
  externalNonPaymentToken?: string;
  /** The transaction object, containing information about the current transaction. */
  transaction: TransactionEntity;
}
