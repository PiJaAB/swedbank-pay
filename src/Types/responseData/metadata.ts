import { MaybePopulated } from '..';

export interface MetadataResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  /** The metadata object. It contains arbitrary key/value pairs */
  readonly metadata: MaybePopulated<{
    /** Key value pairs */
    [key: string]: string | boolean | number | undefined;
  }>;
}
