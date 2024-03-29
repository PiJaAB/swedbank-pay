import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'cancelled';

export default class Cancelled extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.CancelledResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the reason for cancellation, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getCancelReason(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ cancelReason }) => cancelReason ?? null,
    );
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
   * Get the amount, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getAmount(forceFresh?: boolean): Promise<number | null> {
    return this.getAll(forceFresh).then(({ amount }) => amount ?? null);
  }

  /**
   * Get the paymentTokens, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getTokens(
    forceFresh?: boolean,
  ): Promise<ReadonlyArray<responseData.CancelledTokenResponse>> {
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
