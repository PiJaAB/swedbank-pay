import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'urls';

export default class Urls extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.UrlsResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the completeUrl, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getCompleteUrl(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ completeUrl }) => completeUrl ?? null,
    );
  }

  /**
   * Get the cancelUrl, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getCancelUrl(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ cancelUrl }) => cancelUrl ?? null);
  }

  /**
   * Get the paymentUrl, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getPaymentUrl(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ paymentUrl }) => paymentUrl ?? null);
  }

  /**
   * Get the callbackUrl, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getCallbackUrl(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ callbackUrl }) => callbackUrl ?? null,
    );
  }

  /**
   * Get the termsOfServiceUrl, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getTermsOfServiceUrl(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(
      ({ termsOfServiceUrl }) => termsOfServiceUrl ?? null,
    );
  }

  /**
   * Get the hosts url list, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getHostUrls(forceFresh?: boolean): Promise<ReadonlyArray<string>> {
    return this.getAll(forceFresh).then(({ hostUrls }) => hostUrls ?? []);
  }
}
