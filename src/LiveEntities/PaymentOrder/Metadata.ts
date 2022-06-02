import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import { PaymentOrderEntity } from './paymentOrderEntity';

const ENTITY_KEY = 'metadata';

export default class Metadata extends PaymentOrderEntity<
  typeof ENTITY_KEY,
  responseData.MetadataResponse
> {
  constructor(client: SwedbankPayClient, id: string) {
    super(client, ENTITY_KEY, id);
  }

  /**
   * Get the value for a certain key. Fetching from swedbank pay if needed.
   * @param forceFresh - Force a refresh of the historyList from the backend
   */
  getValue(
    key: string,
    defaultVal: string | boolean | number,
    forceFresh?: boolean,
  ): Promise<string | boolean | number>;
  getValue(
    key: string,
    defaultVal?: string | boolean | number,
    forceFresh?: boolean,
  ): Promise<string | boolean | number | null>;
  getValue(
    key: string,
    defaultVal?: string | boolean | number,
    forceFresh?: boolean,
  ): Promise<string | boolean | number | null> {
    return this.getAll(forceFresh).then(
      ({ [key]: value }) => value ?? defaultVal ?? null,
    );
  }
}
