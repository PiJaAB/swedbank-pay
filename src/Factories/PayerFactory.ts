import type { Mutable, requestData } from '../Types';
import SwedbankPayClient from '../SwedbankPayClient';
import { ObjectEntries, ObjectFromEntries } from '../utils/ObjectEntries';

export type BillingAddress = {
  readonly [key in keyof requestData.Payer['billingAddress']]?:
    | requestData.Payer['billingAddress'][key];
};

export type ShippingAddress = {
  readonly [key in keyof NonNullable<
    requestData.Payer['shippingAddress']
  >]?: NonNullable<requestData.Payer['shippingAddress']>[key];
};

export type PayerFactoryOptions = {
  readonly digitalProducts?: boolean;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly msisdn?: string;
  readonly billingAddress?: Partial<requestData.Payer['billingAddress']>;
  readonly shippingAddress?: requestData.Payer['shippingAddress'];
  readonly payerReference?: string;
  readonly nationalIdentifier?: requestData.Payer['nationalIdentifier'];
  readonly accountInfo?: requestData.Payer['accountInfo'];
};

export interface AccountInfoSetter {
  /**
   * Indicates the age of the payer’s account.
   * Autocalculate by providing a date object of account creation
   *- `01` No account, guest checkout
   *- `02` Created during this transaction
   *- `03` Less than 30 days old
   *- `04` 30 to 60 days old
   *- `05` More than 60 days old
   */
  readonly accountAgeIndicator?:
    | '01'
    | '02'
    | '03'
    | '04'
    | '05'
    | 'now'
    | 'guest'
    | Date;
  /**
   * Indicates when the last account changes occurred.
   * Autocalculate by providing a date object of account creation
   *- `01` Changed during this transaction
   *- `02` Less than 30 days ago
   *- `03` 30 to 60 days ago
   *- `04` More than 60 days ago
   */
  readonly accountChangeIndicator?: '01' | '02' | '03' | '04' | 'now' | Date;
  /** Indicates when the account’s password was last changed.
   * Autocalculate by providing a date object of account creation
   *- `01` No changes
   *- `02` Changed during this transaction
   *- `03` Less than 30 days ago
   *- `04` 30 to 60 days ago
   *- `05` More than 60 days old
   */
  readonly accountChangePwdIndicator?:
    | '01'
    | '02'
    | '03'
    | '04'
    | '05'
    | 'now'
    | 'no-change'
    | Date;
  /**
   * Indicates when the payer’s shipping address was last used.
   * Autocalculate by providing a date object of account creation
   *- `01` Changed during this transaction
   *- `02` Less than 30 days ago
   *- `03` 30 to 60 days ago
   *- `04` More than 60 days ago
   */
  readonly shippingAddressUsageIndicator?:
    | '01'
    | '02'
    | '03'
    | '04'
    | 'this-transaction'
    | Date;
  /**
   * Indicates if the account name tches the shipping name.
   *- `01` Account name identical to shipping name
   *- `02` Account name different from shipping name
   */
  readonly shippingNameIndicator?: '01' | '02' | 'identical' | 'different';
  /**
   * Indicates if there have been any suspicious activities linked to this account.
   *- `01` No suspicious activity has been observed
   *- `02` Suspicious activity has been observed
   */
  readonly suspiciousAccountActivity?: '01' | '02' | boolean;
}

const DAY_IN_MILLIS = 1000 * 86400000;

function parseAccountInfoValue(
  setter: AccountInfoSetter,
): requestData.Payer['accountInfo'] {
  type AccountInfo = NonNullable<requestData.Payer['accountInfo']>;
  const entries = ObjectEntries(setter);
  const now = Date.now();
  return ObjectFromEntries(
    entries
      .map(([key, value]) => {
        switch (key) {
          case 'accountAgeIndicator': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal =
                value === 'now' ? '02' : value === 'guest' ? '01' : value;
            } else if (value instanceof Date) {
              const diff = now - value.getTime();
              if (diff < DAY_IN_MILLIS * 30) {
                newVal = '03';
              } else if (diff < DAY_IN_MILLIS * 60) {
                newVal = '04';
              } else if (Number.isFinite(diff)) {
                newVal = '05';
              }
            }
            return [key, newVal] as const;
          }
          case 'accountChangeIndicator': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal = value === 'now' ? '01' : value;
            } else if (value instanceof Date) {
              const diff = now - value.getTime();
              if (diff < DAY_IN_MILLIS * 30) {
                newVal = '02';
              } else if (diff < DAY_IN_MILLIS * 60) {
                newVal = '03';
              } else if (Number.isFinite(diff)) {
                newVal = '04';
              }
            }
            return [key, newVal] as const;
          }
          case 'accountChangePwdIndicator': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal =
                value === 'now' ? '02' : value === 'no-change' ? '01' : value;
            } else if (value instanceof Date) {
              const diff = now - value.getTime();
              if (diff < DAY_IN_MILLIS * 30) {
                newVal = '03';
              } else if (diff < DAY_IN_MILLIS * 60) {
                newVal = '04';
              } else if (Number.isFinite(diff)) {
                newVal = '05';
              }
            }
            return [key, newVal] as const;
          }
          case 'shippingAddressUsageIndicator': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal = value === 'this-transaction' ? '01' : value;
            } else if (value instanceof Date) {
              const diff = now - value.getTime();
              if (diff < DAY_IN_MILLIS * 30) {
                newVal = '02';
              } else if (diff < DAY_IN_MILLIS * 60) {
                newVal = '03';
              } else if (Number.isFinite(diff)) {
                newVal = '04';
              }
            }
            return [key, newVal] as const;
          }
          case 'shippingNameIndicator': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal =
                value === 'different'
                  ? '02'
                  : value === 'identical'
                  ? '01'
                  : value;
            }
            return [key, newVal] as const;
          }
          case 'suspiciousAccountActivity': {
            let newVal: AccountInfo[typeof key];
            if (typeof value === 'string') {
              newVal = value;
            } else if (typeof value === 'boolean') {
              newVal = value ? '02' : '01';
            }
            return [key, newVal] as const;
          }
          default:
            return null;
        }
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> =>
          entry != null && typeof entry[1] !== 'undefined',
      ),
  );
}

export default class PayerFactory {
  private _firstName: string | undefined;
  private _lastName: string | undefined;
  private _digitalProducts: boolean | undefined;
  private _nationalIdentifier: {
    socialSecurityNumber?: string;
    countryCode?: string;
  };
  private _email: string | undefined;
  private _msisdn: string | undefined;
  private readonly _billingAddress: Mutable<BillingAddress>;
  private readonly _shippingAddress: Mutable<ShippingAddress>;
  private _payerReference: string | undefined;
  private readonly _accountInfo: {
    -readonly [key in keyof NonNullable<requestData.Payer['accountInfo']>]?:
      | NonNullable<requestData.Payer['accountInfo']>[key];
  };

  readonly client: SwedbankPayClient;

  constructor(client: SwedbankPayClient, options?: PayerFactoryOptions);
  constructor(
    client: SwedbankPayClient,
    {
      firstName,
      lastName,
      digitalProducts,
      email,
      msisdn,
      billingAddress,
      shippingAddress,
      payerReference,
      accountInfo,
      nationalIdentifier,
    }: PayerFactoryOptions = {},
  ) {
    this.client = client;
    this._digitalProducts = digitalProducts;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._msisdn = msisdn;
    this._billingAddress = billingAddress ?? {};
    this._shippingAddress = shippingAddress ?? {};
    this._payerReference = payerReference;
    this._accountInfo = accountInfo ?? {};
    this._nationalIdentifier = { ...nationalIdentifier };
  }
  /** The first name of the payer. */
  get firstName() {
    return this._firstName;
  }

  /**
   * The first name of the payer.
   * @param newFirstName The new first name
   * @returns The payer factory for chaining.
   */
  setFirstName(newFirstName?: string) {
    this._firstName = newFirstName;
    return this;
  }

  /** The last name of the payer. */
  get lastName() {
    return this._lastName;
  }

  /**
   * The last name of the payer.
   * @param newLastName The new last name
   * @returns The payer factory for chaining.
   */
  setLastName(newLastName?: string) {
    this._lastName = newLastName;
    return this;
  }

  /**
   * The e-mail address of the payer. Will be used to prefill the Checkin as well as on the payer’s profile, if not already set.
   * Increases the chance for frictionless [3-D Secure 2 flow](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   */
  get email() {
    return this._email;
  }

  /**
   * The e-mail address of the payer. Will be used to prefill the Checkin as well as on the payer’s profile, if not already set.
   * Increases the chance for frictionless [3-D Secure 2 flow](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   * @param newEmail The new email
   * @returns The payer factory for chaining.
   */
  setEmailName(newEmail?: string) {
    this._email = newEmail;
    return this;
  }

  /*
   * The mobile phone number of the Payer. Will be prefilled on Checkin page and used on the payer’s profile, if not already set.
   * The mobile number must have a country code prefix and be 8 to 15 digits in length.
   * The field is related to [3-D Secure 2](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   */
  get msisdn() {
    return this._msisdn;
  }

  /**
   * The e-mail address of the payer. Will be used to prefill the Checkin as well as on the payer’s profile, if not already set.
   * Increases the chance for frictionless [3-D Secure 2 flow](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   * @param newMsisdn The new msisdn
   * @returns The payer factory for chaining.
   */
  setMsisdn(newMsisdn?: string) {
    this._msisdn = newMsisdn;
    return this;
  }

  get billingAddress(): BillingAddress | undefined {
    const mergedBilling = {
      firstName: this._billingAddress?.firstName || this.firstName,
      lastName: this._billingAddress?.lastName || this.lastName,
      ...this._billingAddress,
    };
    return Object.entries(mergedBilling).some(
      ([, val]) => typeof val !== 'undefined',
    )
      ? mergedBilling
      : undefined;
  }

  /**
   * The billing address object containing information about the payer’s billing address.
   * @param newBillingAddress The new billing address
   * @param merge Whether to merge with existing address. Replaces entirely if false
   * @returns The payer factory for chaining.
   */
  setBillingAddress(newBillingAddress?: BillingAddress, merge?: boolean) {
    const mergedKeys = new Set(
      ...[
        Object.keys(this._billingAddress),
        Object.keys(newBillingAddress ?? {}),
      ],
    ) as Set<keyof typeof this._billingAddress>;
    mergedKeys.forEach(
      <K extends keyof typeof this._billingAddress>(key: K) => {
        const newVal = newBillingAddress?.[key];
        if (typeof newVal === 'undefined' && !merge) {
          delete this._billingAddress[key];
        } else {
          this._billingAddress[key] = newVal;
        }
      },
    );
    return this;
  }

  /** The shipping address object related to the `payer`. The field is related to [3-D Secure 2](). */
  get shippingAddress(): ShippingAddress | undefined {
    return Object.entries(this._shippingAddress).some(
      ([, val]) => typeof val !== 'undefined',
    )
      ? this._shippingAddress
      : undefined;
  }

  /**
   * The shipping address object related to the `payer`. The field is related to [3-D Secure 2]().
   * @param newShippingAddress The new shipping address
   * @param merge Whether to merge with existing address. Replaces entirely if false
   * @returns The payer factory for chaining.
   */
  setShippingAddress(newShippingAddress?: ShippingAddress, merge?: boolean) {
    const mergedKeys = new Set(
      ...[
        Object.keys(this._shippingAddress),
        Object.keys(newShippingAddress ?? {}),
      ],
    ) as Set<keyof typeof this._shippingAddress>;
    mergedKeys.forEach(
      <K extends keyof typeof this._shippingAddress>(key: K) => {
        const newVal = newShippingAddress?.[key];
        if (typeof newVal === 'undefined' && !merge) {
          delete this._shippingAddress[key];
        } else {
          this._shippingAddress[key] = newVal;
        }
      },
    );
    return this;
  }

  /**
   * A reference used in Enterprise integrations to recognize the payer in the absence of SSN and/or a secure login.
   * Read more about this in the [`payerReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/optional/enterprise-payer-reference) feature section.
   */
  get payerReference() {
    return this._payerReference;
  }

  /**
   * A reference used in Enterprise integrations to recognize the payer in the absence of SSN and/or a secure login.
   * Read more about this in the [`payerReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/optional/enterprise-payer-reference) feature section.
   * @param newPayerReference The new reference
   * @returns The payer factory for chaining.
   */
  setPayerReference(newPayerReference?: string) {
    this._payerReference = newPayerReference;
    return this;
  }

  /** Set to `true` for merchants who only sell digital goods and only require `email` and/or `msisdn` as shipping details. Set to `false` if the merchant also sells physical goods. */
  get digitalProducts() {
    return this._digitalProducts;
  }

  /**
   * Set to `true` for merchants who only sell digital goods and only require `email` and/or `msisdn` as shipping details. Set to `false` if the merchant also sells physical goods.
   * @param newDigitalProducts The new reference
   * @returns The payer factory for chaining.
   */
  setDigitalProducts(newDigitalProducts?: boolean) {
    this._digitalProducts = newDigitalProducts;
    return this;
  }

  /** The payer’s social security number. */
  get socialSecurityNumber() {
    return this._nationalIdentifier.socialSecurityNumber;
  }

  /**
   * The payer’s social security number.
   * @param newSocialSecurityNumber The new social security number
   * @returns The payer factory for chaining.
   */
  setSocialSecurityNumber(newSocialSecurityNumber?: string) {
    this._nationalIdentifier.socialSecurityNumber = newSocialSecurityNumber;
    return this;
  }

  /** The national identifier object. */
  get nationalIdentifier(): {
    readonly socialSecurityNumber?: string;
    readonly countryCode?: string;
  } {
    return this._nationalIdentifier;
  }

  /**
   * The national identifier object.
   * @param newNationalIdentifier The new social security number
   * @returns The payer factory for chaining.
   */
  setNationalIdentifier(newNationalIdentifier?: {
    readonly socialSecurityNumber?: string;
    readonly countryCode?: string;
  }) {
    this._nationalIdentifier = {
      ...newNationalIdentifier,
    };
    return this;
  }

  get accountInfo() {
    const accountInfo = this._accountInfo;
    return accountInfo as Readonly<typeof accountInfo>;
  }

  /**
   * The shipping address object related to the `payer`. The field is related to [3-D Secure 2]().
   * @param newAccountInfo The new shipping address
   * @param merge Whether to merge with existing address. Replaces entirely if false
   * @returns The payer factory for chaining.
   */
  setAccountInfo(newAccountInfo?: AccountInfoSetter, merge?: boolean) {
    const parsedAccountInfo =
      newAccountInfo && parseAccountInfoValue(newAccountInfo);
    const mergedKeys = new Set(
      ...[Object.keys(this._accountInfo), Object.keys(parsedAccountInfo ?? {})],
    ) as Set<keyof typeof this._accountInfo>;
    mergedKeys.forEach(<K extends keyof typeof this._accountInfo>(key: K) => {
      const newVal = parsedAccountInfo?.[key];
      if (typeof newVal === 'undefined' && !merge) {
        delete this._accountInfo[key];
      } else {
        this._accountInfo[key] = newVal;
      }
    });
    return this;
  }

  toJSON(): PayerFactoryOptions | undefined {
    const {
      firstName,
      lastName,
      email,
      msisdn,
      billingAddress,
      shippingAddress,
      payerReference,
      accountInfo,
      nationalIdentifier,
      digitalProducts,
    } = this;

    const ret = {
      digitalProducts,
      firstName,
      lastName,
      email,
      msisdn,
      billingAddress: billingAddress,
      shippingAddress,
      payerReference,
      nationalIdentifier,
      accountInfo: Object.entries(accountInfo).some(
        ([, val]) => typeof val !== 'undefined',
      )
        ? accountInfo
        : undefined,
    };

    return Object.entries(ret).some(([, val]) => typeof val !== 'undefined')
      ? ret
      : undefined;
  }

  getErrors(): [key: string, msg: string][] {
    // Empty payer object is allowed
    if (typeof this.toJSON() === 'undefined') return [];
    const errors: [key: string, msg: string][] = [];
    const { firstName, lastName, billingAddress, shippingAddress } = this;
    if (!firstName) {
      errors.push(['firstName', 'First name is required']);
    }
    if (!lastName) {
      errors.push(['lastName', 'Last name is required']);
    }
    if (!billingAddress) {
      errors.push(['billingAddress', 'Billing address is required']);
    } else {
      const { city, countryCode, streetAddress, zipCode } = billingAddress;
      if (!city) {
        errors.push(['billingAddress.city', 'City is required']);
      }
      if (!countryCode) {
        errors.push(['billingAddress.countryCode', 'Country code is required']);
      }
      if (!streetAddress) {
        errors.push([
          'billingAddress.streetAddress',
          'Street address is required',
        ]);
      }
      if (!zipCode) {
        errors.push(['billingAddress.zipCode', 'Zip code is required']);
      }
    }
    if (typeof shippingAddress !== 'undefined') {
      const {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        city,
        countryCode,
        streetAddress,
        zipCode,
      } = shippingAddress;
      if (!shippingFirstName) {
        errors.push(['shippingAddress.firstName', 'First Name is required']);
      }
      if (!shippingLastName) {
        errors.push(['shippingAddress.lastName', 'Last Name is required']);
      }
      if (!city) {
        errors.push(['shippingAddress.city', 'City is required']);
      }
      if (!countryCode) {
        errors.push([
          'shippingAddress.countryCode',
          'Country code is required',
        ]);
      }
      if (!streetAddress) {
        errors.push([
          'shippingAddress.streetAddress',
          'Street address is required',
        ]);
      }
      if (!zipCode) {
        errors.push(['shippingAddress.zipCode', 'Zip code is required']);
      }
    }
    return errors;
  }
}
