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
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getInstrument(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ instrument }) => instrument ?? null);
  }

  /**
   * Get the payment number, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getNumber(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ number }) => number ?? null);
  }

  /**
   * Get the payeeReference, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getPayeeReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ payeeReference }) => payeeReference ?? null,
    );
  }

  /**
   * Get the orderReference, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getOrderReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ orderReference }) => orderReference ?? null,
    );
  }

  /**
   * Get the amount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ amount }) => amount ?? null);
  }

  /**
   * Get the paymentTokens, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getTokens(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.PaidTokenResponse>> {
    return this.getAll(forceFresh).then(({ tokens }) => tokens ?? []);
  }

  /**
   * Get the details, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getDetails(forceFresh?: boolean): Promise<{
    readonly nonPaymentToken?: string | undefined;
    readonly externalNonPaymentToken?: string | undefined;
  }> {
    return this.getAll(forceFresh).then(({ details }) => details ?? {});
  }
}
