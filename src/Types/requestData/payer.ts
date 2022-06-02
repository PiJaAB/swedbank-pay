export default interface Payer {
  /** Set to `true` for merchants who only sell digital goods and only require `email` and/or `msisdn` as shipping details. Set to `false` if the merchant also sells physical goods. */
  readonly digitalProducts?: boolean;
  /** The national identifier object. */
  readonly nationalIdentifier?: {
    /** The payer’s social security number. */
    readonly socialSecurityNumber?: string;
    /** The country code of the payer. */
    readonly countryCode?: string;
  };
  /** The first name of the payer. */
  readonly firstName: string;
  /** The last name of the payer. */
  readonly lastName: string;
  /**
   * The e-mail address of the payer. Will be used to prefill the Checkin as well as on the payer’s profile, if not already set.
   * Increases the chance for frictionless [3-D Secure 2 flow](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   */
  readonly email?: string;
  /**
   * The mobile phone number of the Payer. Will be prefilled on Checkin page and used on the payer’s profile, if not already set.
   * The mobile number must have a country code prefix and be 8 to 15 digits in length.
   * The field is related to [3-D Secure 2](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/3d-secure-2).
   */
  readonly msisdn?: string;
  /**
   * A reference used in Enterprise integrations to recognize the payer in the absence of SSN and/or a secure login.
   * Read more about this in the [`payerReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/optional/enterprise-payer-reference) feature section.
   */
  readonly payerReference?: string;
  /** The shipping address object related to the `payer`. The field is related to [3-D Secure 2](). */
  readonly shippingAddress?: {
    /** The first name of the addressee – the receiver of the shipped goods. */
    readonly firstName?: string;
    /** The last name of the addressee – the receiver of the shipped goods. */
    readonly lastName?: string;
    /**
     * Payer’s street address.
     * @maxlen 50
     */
    readonly streetAddress?: string;
    /** Payer’ s c/o address, if applicable. */
    readonly coAddress?: string;
    /** Payer’s zip code */
    readonly zipCode?: string;
    /** Payer’s city of residence. */
    readonly city?: string;
    /** Country code for country of residence. */
    readonly countryCode?: string;
  };
  /** The billing address object containing information about the payer’s billing address. */
  readonly billingAddress: {
    /** The first name of the payer. */
    readonly firstName: string;
    /** The last name of the payer. */
    readonly lastName: string;
    /**
     * The street address of the payer.
     * @maxlen 50
     */
    readonly streetAddress: string;
    /** The CO-address (if used) */
    readonly coAddress?: string;
    /** The postal number (ZIP code) of the payer. */
    readonly zipCode: string;
    /** The city of the payer. */
    readonly city: string;
    /** Country code for payer. */
    readonly countryCode: 'SE' | 'NO' | 'FI';
  };
  /** Object related to the payer containing info about the payer’s account. */
  readonly accountInfo?: {
    /**
     * Indicates the age of the payer’s account.
     *- `01` No account, guest checkout
     *- `02` Created during this transaction
     *- `03` Less than 30 days old
     *- `04` 30 to 60 days old
     *- `05` More than 60 days old
     */
    readonly accountAgeIndicator?: '01' | '02' | '03' | '04' | '05';
    /**
     * Indicates when the last account changes occurred.
     *- `01` Changed during this transaction
     *- `02` Less than 30 days ago
     *- `03` 30 to 60 days ago
     *- `04` More than 60 days ago
     */
    readonly accountChangeIndicator?: '01' | '02' | '03' | '04';
    /** Indicates when the account’s password was last changed.
     *- `01` No changes
     *- `02` Changed during this transaction
     *- `03` Less than 30 days ago
     *- `04` 30 to 60 days ago
     *- `05` More than 60 days ago
     */
    readonly accountChangePwdIndicator?: '01' | '02' | '03' | '04' | '05';
    /**
     * Indicates when the payer’s shipping address was last used.
     * (The above comes from the official SwedbankPay docs)
     *- `01` This transaction
     *- `02` Less than 30 days ago
     *- `03` 30 to 60 days ago
     *- `04` More than 60 days ago
     */
    readonly shippingAddressUsageIndicator?: '01' | '02' | '03' | '04';
    /**
     * Indicates if the account name matches the shipping name.
     *- `01` Account name identical to shipping name
     *- `02` Account name different from shipping name
     */
    readonly shippingNameIndicator?: '01' | '02';
    /**
     * Indicates if there have been any suspicious activities linked to this account.
     *- `01` No suspicious activity has been observed
     *- `02` Suspicious activity has been observed
     */
    readonly suspiciousAccountActivity?: '01' | '02';
  };
}
