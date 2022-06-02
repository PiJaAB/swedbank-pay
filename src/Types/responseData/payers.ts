import { MaybePopulated } from '..';

export interface PayerDeviceResponse {
  readonly detectionAccuracy: number;
  /** The IP address that connected to Swedbank Pay's checkout */
  readonly ipAddress: string;
  /** The User Agent that connected to Swedbank Pay's checkout */
  readonly userAgent: string;
  /** The device type that connected to Swedbank Pay's checkout */
  readonly deviceType: string;
  /** The hardware family that connected to Swedbank Pay's checkout */
  readonly hardwareFamily: string;
  /** The name of the hardware that connected to Swedbank Pay's checkout */
  readonly hardwareName: string;
  /** The hardware vendor that connected to Swedbank Pay's checkout */
  readonly hardwareVendor: string;
  /** The platform name (Operating System) that connected to Swedbank Pay's checkout */
  readonly platformName: string;
  /** The platform vendor that connected to Swedbank Pay's checkout */
  readonly platformVendor: string;
  /** The IP address that connected to Swedbank Pay's checkout */
  readonly platformVersion: string;
  /** The browser that connected to Swedbank Pay's checkout */
  readonly browserName: string;
  /** The browser vendor that connected to Swedbank Pay's checkout */
  readonly browserVendor: string;
  /** The browser version that connected to Swedbank Pay's checkout */
  readonly browserVersion: string;
  /** Whether the browser that connected to Swedbank Pay's checkout had Java enabled */
  readonly browserJavaEnabled: boolean;
}

export interface PayersResponse {
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentOrder?: string;
  /** The parent payment order id. (The api is inconsistent so both camelcase and lowercase is supported) */
  readonly paymentorder?: string;
  /** The payer object. */
  readonly payer: MaybePopulated<{
    /** The name of the payer */
    readonly name: string;
    /** Device infromation about the browser that used Swedbank Pay's payment service */
    readonly device?: PayerDeviceResponse;
  }>;
}
