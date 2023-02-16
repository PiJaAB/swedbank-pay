import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'payer';

export default class Payer extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.PayersResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the name of the payer, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getName(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ name }) => name ?? null);
  }

  /**
   * Get the msisdn of the payer, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getMsisdn(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ msisdn }) => msisdn ?? null);
  }

  /**
   * Get the reference of the payer, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getReference(forceFresh?: boolean): Promise<string | null> {
    return this.getAll(forceFresh).then(({ reference }) => reference ?? null);
  }

  /**
   * Get the device info of the payer, fetches from Swedbank Pay backend if necessary.
   * @param forceFresh - Force a refresh from Swedbank Pay before resolving
   */
  getDevice(
    forceFresh?: boolean,
  ): Promise<responseData.PayerDeviceResponse | null> {
    return this.getAll(forceFresh).then(({ device }) => device ?? null);
  }
}
