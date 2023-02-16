import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'paid';

export default class Paid extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.PaidResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the payment instrument, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getInstrument(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ instrument }) => instrument ?? null);
  }

  /**
   * Get the payment number, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getNumber(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ number }) => number ?? null);
  }

  /**
   * Get the payeeReference, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getPayeeReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ payeeReference }) => payeeReference ?? null,
    );
  }

  /**
   * Get the orderReference, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getOrderReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ orderReference }) => orderReference ?? null,
    );
  }

  /**
   * Get the transactionType, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getTransactionType(
    forceFresh?: boolean,
  ): Promise<'Authorization' | 'Sale' | 'Verification' | null> {
    return this.getAll(forceFresh).then(
      ({ transactionType }) => transactionType ?? null,
    );
  }

  /**
   * Get the amount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ amount }) => amount ?? null);
  }

  /**
   * Get the submittedAmount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getSubmittedAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(
      ({ submittedAmount }) => submittedAmount ?? null,
    );
  }

  /**
   * Get the feeAmount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getFeeAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ feeAmount }) => feeAmount ?? null);
  }

  /**
   * Get the discountAmount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getDiscountAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(
      ({ discountAmount }) => discountAmount ?? null,
    );
  }

  /**
   * Get the paymentTokens, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getTokens(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.PaidTokenResponse>> {
    return this.getAll(forceFresh).then(({ tokens }) => tokens ?? []);
  }

  /**
   * Get the details, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getDetails(forceFresh?: boolean): Promise<{
    readonly nonPaymentToken?: string | undefined;
    readonly externalNonPaymentToken?: string | undefined;
  }> {
    return this.getAll(forceFresh).then(({ details }) => details ?? {});
  }
}
