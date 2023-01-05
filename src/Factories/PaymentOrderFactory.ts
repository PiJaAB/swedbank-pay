import {
  PaymentOrderOperation,
  PaymentOrderResponse,
  requestData,
  PaymentInstrument,
  IntTypeMap,
} from '../Types';
import PayerFactory, { PayerFactoryOptions } from './PayerFactory';
import OrderItemFactory, {
  QUANTITY_PRECISION,
  OrderItemFactoryOptions,
} from './OrderItemFactory';
import InvalidEntityError from '../Errors/InvalidEntityError';
import type SwedbankPayClient from '../SwedbankPayClient';
import LiveEntities from '../LiveEntities';

export type Serialized = PaymentOrderFactory<
  SwedbankPayClient<never>
>['toJSON'] extends () => infer Q
  ? Q
  : never;

export type PaymentOrderFactoryOptions = {
  readonly paymentorder?: {
    readonly currency?: string;
    readonly description?: string;
    readonly generatePaymentToken?: boolean;
    readonly generateRecurrenceToken?: boolean;
    readonly instrument?: string;
    readonly language?: string;
    readonly operation?: PaymentOrderOperation;
    readonly recurrenceToken?: string;
    readonly userAgent?: string;

    readonly payeeInfo?: Partial<requestData.PaymentOrder['payeeInfo']>;
    readonly payer?: PayerFactoryOptions;
    readonly urls?: {
      readonly callbackUrl?: string;
      readonly completeUrl?: string;
      readonly cancelUrl?: string;
      readonly paymentUrl?: string;
      readonly termsOfServiceUrl?: string;
      readonly hostUrls?: readonly string[];
    };
  };
  readonly orderItems?: ReadonlyArray<OrderItemFactoryOptions>;
};

export default class PaymentOrderFactory<
  Client extends SwedbankPayClient<keyof IntTypeMap>,
> {
  private _currency: string | undefined;
  private _description: string | undefined;
  private _generatePaymentToken: boolean | undefined;
  private _generateRecurrenceToken: boolean | undefined;
  private _instrument: PaymentInstrument | undefined;
  private _language: string | undefined;
  private _operation: PaymentOrderOperation | undefined;
  private _productCategory: string | undefined;
  private _payeeName: string | undefined;
  private _reference: string | undefined;
  private _subsite: string | undefined;
  private _userAgent: string | undefined;
  private _orderReference: string | undefined;
  private _recurrenceToken: string | undefined;
  private _hostUrls: string[];
  private _callbackUrl:
    | requestData.PaymentOrder['urls']['callbackUrl']
    | undefined;
  private _completeUrl:
    | requestData.PaymentOrder['urls']['completeUrl']
    | undefined;
  private _paymentUrl: requestData.PaymentOrder['urls']['paymentUrl'];
  private _termsOfServiceUrl:
    | requestData.PaymentOrder['urls']['termsOfServiceUrl']
    | undefined;
  private _cancelUrl: requestData.PaymentOrder['urls']['cancelUrl'];

  private _orderItems: OrderItemFactory<Client>[];
  /** Factory for the payer of the purchase */
  readonly payer: PayerFactory<Client>;
  /** The client */
  readonly client: Client;

  constructor(client: Client, options?: PaymentOrderFactoryOptions);
  constructor(
    client: Client,
    { paymentorder, orderItems }: PaymentOrderFactoryOptions = {},
  ) {
    this._currency = paymentorder?.currency;
    this._language = paymentorder?.language;
    this._description = paymentorder?.description;
    this._operation = paymentorder?.operation;
    this._reference = paymentorder?.payeeInfo?.payeeReference;
    this._orderReference = paymentorder?.payeeInfo?.orderReference;
    this._userAgent = paymentorder?.userAgent;
    this.payer = new PayerFactory(client, paymentorder?.payer);
    this._generatePaymentToken = paymentorder?.generatePaymentToken;
    this._generateRecurrenceToken = paymentorder?.generateRecurrenceToken;
    this._recurrenceToken = paymentorder?.recurrenceToken;
    this._callbackUrl = paymentorder?.urls?.callbackUrl;
    this._cancelUrl = paymentorder?.urls?.cancelUrl;
    this._completeUrl = paymentorder?.urls?.completeUrl;
    this._hostUrls = paymentorder?.urls?.hostUrls
      ? paymentorder.urls.hostUrls.filter(
          (n): n is NonNullable<typeof n> => n != null,
        )
      : [];
    this._paymentUrl = paymentorder?.urls?.paymentUrl;
    this._termsOfServiceUrl = paymentorder?.urls?.termsOfServiceUrl;
    this._productCategory = paymentorder?.payeeInfo?.productCategory;
    this._subsite = paymentorder?.payeeInfo?.subsite;
    this._payeeName = paymentorder?.payeeInfo?.payeeName;
    this._orderItems =
      orderItems?.map((item) => new OrderItemFactory(client, item)) ?? [];
    this.client = client;
  }

  /**
   * The amount of the purchase
   */
  get amount() {
    return this.orderItems.reduce((acc, cur) => {
      return acc + (cur.amount ?? 0n);
    }, 0n);
  }

  /**
   * The vat amount of the purchase
   */
  get vatAmount() {
    return this.orderItems.reduce((acc, cur) => {
      return acc + (cur.vatAmount ?? 0n);
    }, 0n);
  }

  /** The `urls` object, containing the URLs relevant for the payment order. */
  get urls() {
    return {
      callbackUrl: this.callbackUrl,
      completeUrl: this.completeUrl,
      cancelUrl: this.cancelUrl,
      paymentUrl: this.paymentUrl,
      termsOfServiceUrl: this.termsOfServiceUrl,
      hostUrls: this.hostUrls,
    };
  }

  /**
   * The created recurrenceToken, if `operation: Verify`, `operation: Recur` or `generateRecurrenceToken: true` was used.
   */
  get recurrenceToken() {
    return this._recurrenceToken;
  }

  /**
   * The created recurrenceToken, if `operation: Verify`, `operation: Recur` or `generateRecurrenceToken: true` was used.
   * @param newRecurrenceToken The new value for recurrenceToken
   * @returns The purchase factory for chaining.
   */
  setRecurrenceToken(newRecurrenceToken: string | undefined) {
    this._recurrenceToken = newRecurrenceToken;
    return this;
  }

  /**
   * Set to true if you want to generate an recurrenceToken for future recurring purchases.
   */
  get generateRecurrenceToken() {
    return this._generateRecurrenceToken;
  }

  /**
   * Set to true if you want to generate an recurrenceToken for future recurring purchases.
   * @param newGenerateRecurrenceToken The new value for generateRecurrenceToken
   * @returns The purchase factory for chaining.
   */
  setGenerateRecurrenceToken(newGenerateRecurrenceToken: boolean | undefined) {
    this._generateRecurrenceToken = newGenerateRecurrenceToken;
    return this;
  }

  /**
   * Set to true if you want to generate an recurrenceToken for future recurring purchases.
   */
  get generatePaymentToken() {
    return this._generatePaymentToken;
  }

  /**
   * Set to true if you want to generate an PaymentToken for future recurring purchases.
   * @param newGeneratePaymentToken The new value for generatePaymentToken
   * @returns The purchase factory for chaining.
   */
  setGeneratePaymentToken(newGeneratePaymentToken: boolean | undefined) {
    this._generatePaymentToken = newGeneratePaymentToken;
    return this;
  }

  /**
   * The URL that Swedbank Pay will redirect back to when the payer has completed his or her interactions with the payment.
   * This does not indicate a successful payment, only that it has reached a final (complete) state.
   * A `GET` request needs to be performed on the payment order to inspect it further. See [`completeUrl`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/complete-url) for details.
   */
  get completeUrl() {
    return this._completeUrl;
  }

  /**
   * The URL that Swedbank Pay will redirect back to when the payer has completed his or her interactions with the payment.
   * This does not indicate a successful payment, only that it has reached a final (complete) state.
   * A `GET` request needs to be performed on the payment order to inspect it further. See [`completeUrl`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/complete-url) for details.
   * @param newCompleteUrl The new hostUrls array
   * @returns The purchase factory for chaining.
   */
  setCompleteUrl(newCompleteUrl?: string) {
    this._completeUrl = newCompleteUrl;
    return this;
  }

  /** The URL to redirect the payer to if the payment is cancelled, either by the payer or by the merchant trough an `abort` request of the `payment` or `paymentorder`. */
  get cancelUrl() {
    return this._cancelUrl;
  }

  /**
     The URL to redirect the payer to if the payment is cancelled, either by the payer or by the merchant trough an `abort` request of the `payment` or `paymentorder`.
     * @param newCancelUrl The new hostUrls array
     * @returns The purchase factory for chaining.
     */
  setCancelUrl(newCancelUrl?: string) {
    this._cancelUrl = newCancelUrl;
    return this;
  }

  /** The URL to the API endpoint receiving `POST` requests on transaction activity related to the payment order. */
  get callbackUrl() {
    return this._callbackUrl;
  }

  /**
   * The URL to the API endpoint receiving `POST` requests on transaction activity related to the payment order.
   * @param newCallbackUrl The new hostUrls array
   * @returns The purchase factory for chaining.
   */
  setCallbackUrl(newCallbackUrl?: string) {
    this._callbackUrl = newCallbackUrl;
    return this;
  }

  /** The URL to the terms of service document which the payer must accept in order to complete the payment. **HTTPS is a requirement. */
  get termsOfServiceUrl() {
    return this._termsOfServiceUrl;
  }

  /**
   * The URL to the terms of service document which the payer must accept in order to complete the payment. **HTTPS is a requirement.
   * @param newTermsOfServiceUrl The new hostUrls array
   * @returns The purchase factory for chaining.
   */
  setTermsOfServiceUrl(newTermsOfServiceUrl?: string) {
    this._termsOfServiceUrl = newTermsOfServiceUrl;
    return this;
  }

  /**
   * For our Seamless Views, the field called [`paymentUrl`](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/payment-url) will be used when the payer is redirected out of the Seamless View (the `iframe`). The payer is redirected out of frame when selecting the payment instrument.
   *
   * The URL should represent the page of where the Payment Order Seamless View was hosted originally, such as the checkout page, shopping cart page, or similar. Basically, `paymentUrl` should be set to the same URL as that of the page where the JavaScript for the Seamless View was added to in order to initiate the payment process.
   *
   * Please note that the `paymentUrl` must be able to invoke the same JavaScript URL from the same Payment Order as the one that initiated the payment process originally, so it should include some sort of state identifier in the URL. The state identifier is the ID of the order, shopping cart or similar that has the URL of the Payment stored.
   */
  get paymentUrl() {
    return this._paymentUrl;
  }

  /**
   * For our Seamless Views, the field called [`paymentUrl`](https://developer.swedbankpay.com/checkout-v3/payments-only/features/technical-reference/payment-url) will be used when the payer is redirected out of the Seamless View (the `iframe`). The payer is redirected out of frame when selecting the payment instrument.
   *
   * The URL should represent the page of where the Payment Order Seamless View was hosted originally, such as the checkout page, shopping cart page, or similar. Basically, `paymentUrl` should be set to the same URL as that of the page where the JavaScript for the Seamless View was added to in order to initiate the payment process.
   *
   * Please note that the `paymentUrl` must be able to invoke the same JavaScript URL from the same Payment Order as the one that initiated the payment process originally, so it should include some sort of state identifier in the URL. The state identifier is the ID of the order, shopping cart or similar that has the URL of the Payment stored.
   * @param newPaymentUrl The new hostUrls array
   * @returns The purchase factory for chaining.
   */
  setPaymentUrl(newPaymentUrl?: string) {
    this._paymentUrl = newPaymentUrl;
    return this;
  }

  /** The array of URLs valid for embedding of Swedbank Pay Hosted Views. */
  get hostUrls(): ReadonlyArray<string> {
    return this._hostUrls;
  }

  /**
   * The array of URLs valid for embedding of Swedbank Pay Hosted Views.
   * @param newHostUrls The new hostUrls array
   * @returns The purchase factory for chaining.
   */
  setHostUrls(newHostUrls?: ReadonlyArray<string>) {
    this._hostUrls = newHostUrls != null ? [...newHostUrls] : [];
    return this;
  }

  /**
   * Adds a hostUrl to the hostUrls array.
   * @param newHostUrls The new hostUrls string
   * @returns The purchase factory for chaining.
   */
  addHostUrl(...newHostUrls: string[]) {
    this._hostUrls.push(...newHostUrls);
    return this;
  }

  /** The array of URLs valid for embedding of Swedbank Pay Hosted Views. */
  get orderItems(): ReadonlyArray<OrderItemFactory<Client>> {
    return this._orderItems;
  }

  /**
   * The array of URLs valid for embedding of Swedbank Pay Hosted Views.
   * @param newOrderItems The new orderItems array
   * @returns The purchase factory for chaining.
   */
  setOrderItems(
    newOrderItems?: ReadonlyArray<
      OrderItemFactory<Client> | OrderItemFactoryOptions
    >,
  ) {
    this._orderItems =
      newOrderItems != null
        ? newOrderItems.map((item) =>
            item instanceof OrderItemFactory
              ? item
              : new OrderItemFactory(this.client, item),
          )
        : [];
    return this;
  }

  /**
   * Adds a hostUrl to the hostUrls array.
   * @param newHostUrls The new hostUrls string
   * @returns The purchase factory for chaining.
   */
  addOrderItem(
    ...newHostUrls: (OrderItemFactory<Client> | OrderItemFactoryOptions)[]
  ) {
    this._orderItems.push(
      ...newHostUrls.map((item) =>
        item instanceof OrderItemFactory
          ? item
          : new OrderItemFactory(this.client, item),
      ),
    );
    return this;
  }

  /** The description of the payment order. */
  get description() {
    return this._description;
  }

  /**
   * Sets The description of the payment order.
   * @param newDescription The new description
   * @returns The purchase factory for chaining.
   */
  setDescription(newDescription?: string) {
    this._description = newDescription;
    return this;
  }

  /** The description of the purchase */
  get defaultDescription() {
    const orderItemString = this.orderItems
      .map(
        (item) =>
          `${item.displayQuantity}${item.displayQuantityUnit ?? ''}x${
            item.name
          }`,
      )
      .join(', ');
    if (orderItemString) return orderItemString;
    return undefined;
  }

  /**
   * The currency of the purchase
   */
  get currency() {
    return this._currency;
  }

  /**
   * Sets the currency of the purchase
   * @param newCurrency The new currency
   */
  setCurrency(newCurrency?: string) {
    this._currency = newCurrency;
    return this;
  }

  /** The operation of the purchase */
  get operation() {
    return this._operation;
  }

  /**
   * Sets the operation of the purchase
   * @param newOperation The new operation
   * @returns The purchase factory for chaining.
   */
  setOperation(newOperation?: PaymentOrderOperation) {
    this._operation = newOperation;
    return this;
  }

  /**
   * The instrument to use for this purchace (must be enabled in Swedbank Pay)
   * By default it will present all available instruments to the customer
   */
  get instrument() {
    return this._instrument;
  }

  /**
   * Sets the instrument to use for this purchace (must be enabled in Swedbank Pay)
   * By default it will present all available instruments to the customer
   * @param newInstrument The new operation
   * @returns The purchase factory for chaining.
   */
  setInstrument(newInstrument?: PaymentInstrument) {
    this._instrument = newInstrument;
    return this;
  }

  /** The language of the purchase */
  get language() {
    return this._language;
  }

  /**
   * Sets the language of the purchase
   * @param newLanguage The new language
   * @returns The purchase factory for chaining.
   */
  setLanguage(newLanguage?: string) {
    this._language = newLanguage;
    return this;
  }

  /** Order reference string. */
  get orderReference() {
    return this._orderReference;
  }

  /**
   * Order reference string.
   * @param newOrderReference the new reference string
   * @returns The purchase factory for chaining.
   */
  setOrderReference(newOrderReference?: string) {
    this._orderReference = newOrderReference;
    return this;
  }

  /**
   * A unique reference from the merchant system. It is set per operation to ensure an exactly-once delivery of a transactional operation.
   * See [`payeeReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/payee-reference) for details.
   * In Invoice Payments `payeeReference` is used as an invoice/receipt number, if the `receiptReference` is not defined.
   * @maxlen 30
   */
  get reference() {
    return this._reference;
  }

  /**
   * A unique reference from the merchant system. It is set per operation to ensure an exactly-once delivery of a transactional operation.
   * See [`payeeReference`](https://developer.swedbankpay.com/checkout-v3/enterprise/features/technical-reference/payee-reference) for details.
   * In Invoice Payments `payeeReference` is used as an invoice/receipt number, if the `receiptReference` is not defined.
   * @param newReference the new reference string
   * @maxlen 30
   * @returns The purchase factory for chaining.
   */
  setReference(newReference?: string) {
    this._reference = newReference;
    return this;
  }

  /** The [user agent](https://developer.swedbankpay.com/introduction#user-agent) of the payer. Should typically be set to the value of the `User-Agent` header sent by the payer’s web browser. */
  get userAgent() {
    return this._userAgent;
  }

  /**
   * The [user agent](https://developer.swedbankpay.com/introduction#user-agent) of the payer. Should typically be set to the value of the `User-Agent` header sent by the payer’s web browser.
   * @param newUserAgent the new userAgent string
   * @returns The purchase factory for chaining.
   */
  setUserAgent(newUserAgent?: string) {
    this._userAgent = newUserAgent;
    return this;
  }

  /** A product category or number sent in from the payee/merchant. This is not validated by Swedbank Pay, but will be passed through the payment process and may be used in the settlement process. */
  get productCategory() {
    return this._productCategory;
  }

  /**
   * A product category or number sent in from the payee/merchant. This is not validated by Swedbank Pay, but will be passed through the payment process and may be used in the settlement process.
   * @param newProductCategory the new product category string
   * @returns The purchase factory for chaining.
   */
  setProductCategory(newProductCategory?: string) {
    this._productCategory = newProductCategory;
    return this;
  }

  /**
   * The subsite field can be used to perform [split settlement](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation#split-settlement) on the payment.
   * The subsites must be resolved with Swedbank Pay [reconciliation](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation) before being used.
   * @maxlen 40
   */
  get subsite() {
    return this._subsite;
  }

  /**
   * The subsite field can be used to perform [split settlement](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation#split-settlement) on the payment.
   * The subsites must be resolved with Swedbank Pay [reconciliation](https://developer.swedbankpay.com/checkout-v3/enterprise/features/core/settlement-reconciliation) before being used.
   * @param newSubsite the new subsite string
   * @maxlen 40
   * @returns The purchase factory for chaining.
   */
  setSubsite(newSubsite?: string) {
    this._subsite = newSubsite;
    return this;
  }

  /**
   * The name of the payee, usually the name of the merchant.
   */
  get payeeName() {
    return this._payeeName;
  }

  /**
   * The name of the payee, usually the name of the merchant.
   * @param newPayeeName the new subsite string
   * @returns The purchase factory for chaining.
   */
  setPayeeName(newPayeeName?: string) {
    this._payeeName = newPayeeName;
    return this;
  }

  private getErrors(): [key: string, msg: string][] {
    const errors = [
      ...this.payer
        .getErrors()
        .map<[key: string, msg: string]>(([key, val]) => [`payer.${key}`, val]),
    ];
    const {
      operation,
      language,
      userAgent,
      reference,
      currency,
      description,
      recurrenceToken,
      urls: { completeUrl, hostUrls },
    } = this;
    if (!description && !this.defaultDescription) {
      errors.push([
        'description',
        'Description, or enough fields to autogenerate one, is required',
      ]);
    }
    if (!operation) {
      errors.push(['operation', 'Operation is required']);
    }
    if (operation === 'Recur' && !recurrenceToken) {
      errors.push([
        'recurrenceToken',
        'Recurrence token is required for Recur operation',
      ]);
    }
    if (!language) {
      errors.push(['language', 'Language is required']);
    }
    if (!userAgent) {
      errors.push(['userAgent', 'User-Agent is required']);
    }
    if (!reference) {
      errors.push(['reference', 'Reference is required']);
    }
    if (!currency) {
      errors.push(['currency', 'Currency is required']);
    }
    if (!completeUrl) {
      errors.push(['completeUrl', 'Complete url is required']);
    }
    if (hostUrls.length === 0) {
      errors.push(['hostsUrls', 'At least one host url is required']);
    }
    return errors;
  }

  private serialize(): PaymentOrderFactoryOptions['paymentorder'] {
    const payer = this.payer.toJSON();
    const ret = {
      generatePaymentToken: this._generatePaymentToken,
      generateRecurrenceToken: this._generateRecurrenceToken,
      instrument: this._instrument,
      recurrenceToken: this._recurrenceToken,
      operation: this.operation,
      language: this.language,
      userAgent: this.userAgent,
      payeeInfo: {
        payeeName: this.payeeName,
        payeeReference: this.reference,
        orderReference: this.orderReference,
        productCategory: this.productCategory,
        subsite: this.subsite,
      },
      currency: this.currency,
      description: this.description,
      urls: this.urls,
      payer,
    };
    return ret;
  }

  /**
   * Serializes the purchase to a JSON-encodeable object.
   * @returns A serialized object able to trivially be converted to JSON
   */
  toJSON(): PaymentOrderFactoryOptions {
    const orderItems = this.orderItems.map((o) => o.toJSON());
    return {
      paymentorder: this.serialize(),
      orderItems,
    };
  }

  /**
   * Serializes the purchase for Swedbank Pay
   * and makes a request for the purchase to be created.
   * @returns A live entity of the paymentorder.
   */
  async makePurchaseRequest(): Promise<
    InstanceType<typeof LiveEntities.PaymentOrder<Client>>
  > {
    const errors = this.getErrors();
    const orderItems = this.orderItems.map((o, i) => {
      errors.push(
        ...o
          .getErrors()
          .map<typeof errors[number]>(([key, val]) => [
            `orderItems[${i}].${key}`,
            val,
          ]),
      );
      // Make the precision as close to QUANTITY_PRECISION decimal places
      // as the floating point precision allows.
      const quantity =
        Math.floor(o.quantity) +
        Math.round((o.quantity % 1) * Number(QUANTITY_PRECISION)) /
          Number(QUANTITY_PRECISION);
      return {
        ...o.toJSON(),
        vatAmount: Number(o.vatAmount ?? 0n),
        quantity,
      } as requestData.OrderItem;
    });
    if (errors.length > 0) {
      return Promise.reject(new InvalidEntityError('Purchase', errors));
    }
    const description = (this.description ?? this.defaultDescription) as string;

    const paymentorder = (
      this.serialize as () => Omit<
        requestData.PaymentOrder,
        'productName' | 'payeeInfo' | 'amount' | 'vatAmount' | 'description'
      > & {
        payeeInfo: Omit<requestData.PaymentOrder['payeeInfo'], 'payeeId'>;
        description: string | undefined;
      }
    )();

    const purchase = {
      paymentorder: {
        ...paymentorder,
        productName: 'Checkout3',
        payeeInfo: {
          ...paymentorder.payeeInfo,
          payeeId: this.client.merchantId,
          payeeName:
            paymentorder.payeeInfo.payeeName ?? this.client.merchantName,
        },
        description,
        amount: Number(this.amount),
        vatAmount: Number(this.vatAmount),
        orderItems,
      },
    };

    const res = await this.client.axios.post<PaymentOrderResponse>(
      '/psp/paymentorders',
      purchase,
    );
    return new LiveEntities.PaymentOrder(this.client, res.data, new Date());
  }
}
