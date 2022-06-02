import axios, { AxiosInstance } from 'axios';
import * as LiveEntities from './LiveEntities';
import { responseData } from './Types';
import * as Factories from './Factories';

export type Options = {
  readonly apiToken: string;
  readonly merchantId: string;
  readonly env: 'test' | 'prod';
  readonly merchantName?: string;
};

export class SwedbankPayClient {
  private static apiUrls = {
    test: 'https://api.externalintegration.payex.com',
    prod: 'https://api.payex.com',
  };

  /** Whether we're in production or test mode */
  readonly env: 'test' | 'prod';

  /** The axios instance preconfigured to communicate with Swedbank Pay */
  readonly axios: AxiosInstance;

  /** The ID of the merchant */
  readonly merchantId: string;

  private _merchantName: string | undefined;

  /** Bound version of the {@link Factories.PaymentOrderFactory PaymentOrderFactory} class with client constructor argument prepopulated */
  readonly PaymentOrderFactory: {
    new (
      options?: Factories.PaymentOrderFactoryOptions,
    ): Factories.PaymentOrderFactory;
  };

  /** Bound version of the {@link Factories.OrderItemFactory OrderItemFactory} class with client constructor argument prepopulated */
  readonly OrderItemFactory: {
    new (
      options?: Factories.OrderItemFactoryOptions,
    ): Factories.OrderItemFactory;
  };

  /** Bound version of the {@link Factories.PayerFactory PayerFactory} class with client constructor argument prepopulated */
  readonly PayerFactory: {
    new (options?: Factories.PayerFactoryOptions): Factories.PayerFactory;
  };

  /** Bound version of the {@link LiveEntities.PaymentOrder PaymentOrder} class with client constructor argument prepopulated */
  readonly PaymentOrder: {
    new (
      options: responseData.PaymentOrderResponse,
      fetched: Date,
    ): LiveEntities.PaymentOrder;
    /** Load a payment order from the backend using a specific ID */
    load(id: string): Promise<LiveEntities.PaymentOrder>;
  };

  /** Bound version of the {@link LiveEntities.Aborted Aborted} class with client constructor argument prepopulated */
  readonly Aborted: {
    new (id: string): LiveEntities.Aborted;
  };

  /** Bound version of the {@link LiveEntities.Cancelled Cancelled} class with client constructor argument prepopulated */
  readonly Cancelled: {
    new (id: string): LiveEntities.Cancelled;
  };

  /** Bound version of the {@link LiveEntities.Failed Failed} class with client constructor argument prepopulated */
  readonly Failed: {
    new (id: string): LiveEntities.Failed;
  };

  /** Bound version of the {@link LiveEntities.FailedAttempts FailedAttempts} class with client constructor argument prepopulated */
  readonly FailedAttempts: {
    new (id: string): LiveEntities.FailedAttempts;
  };

  /** Bound version of the {@link LiveEntities.FinancialTransactions FinancialTransactions} class with client constructor argument prepopulated */
  readonly FinancialTransactions: {
    new (id: string): LiveEntities.FinancialTransactions;
  };

  /** Bound version of the {@link LiveEntities.History History} class with client constructor argument prepopulated */
  readonly History: {
    new (id: string): LiveEntities.History;
  };

  /** Bound version of the {@link LiveEntities.Paid Paid} class with client constructor argument prepopulated */
  readonly Paid: {
    new (id: string): LiveEntities.Paid;
  };

  /** Bound version of the {@link LiveEntities.Urls Urls} class with client constructor argument prepopulated */
  readonly Urls: {
    new (id: string): LiveEntities.Urls;
  };

  /** Bound version of the {@link Metadata Metadata} class with client constructor argument prepopulated */
  readonly Metadata: {
    new (id: string): LiveEntities.Metadata;
  };

  /** Bound version of the {@link OrderItems OrderItems} class with client constructor argument prepopulated */
  readonly OrderItems: {
    new (id: string): LiveEntities.OrderItems;
  };

  /** Bound version of the {@link PayeeInfo PayeeInfo} class with client constructor argument prepopulated */
  readonly PayeeInfo: {
    new (id: string): LiveEntities.PayeeInfo;
  };

  /** Bound version of the {@link Payer Payer} class with client constructor argument prepopulated */
  readonly Payer: {
    new (id: string): LiveEntities.Payer;
  };

  /**
   * Creates a new SwedbankPayClient instance.
   * @param options the options for the client
   * @param options.apiToken the API token for the client
   * @param options.merchantId the merchant ID for the client
   * @param options.env the environment to use for the client
   */
  constructor({ apiToken, merchantId, env, merchantName }: Options) {
    this.merchantId = merchantId;
    this.env = env;
    this.axios = axios.create({
      baseURL: SwedbankPayClient.apiUrls[this.env],
      headers: {
        authorization: `Bearer ${apiToken}`,
      },
    });
    this._merchantName = merchantName;
    this.PaymentOrderFactory = Factories.PaymentOrderFactory.bind(null, this);
    this.OrderItemFactory = Factories.OrderItemFactory.bind(null, this);
    this.PayerFactory = Factories.PayerFactory.bind(null, this);
    this.PaymentOrder = Object.assign(
      LiveEntities.PaymentOrder.bind(null, this),
      {
        load: LiveEntities.PaymentOrder.load.bind(
          LiveEntities.PaymentOrder,
          this,
        ),
      },
    );
    this.Aborted = LiveEntities.Aborted.bind(null, this);
    this.Cancelled = LiveEntities.Cancelled.bind(null, this);
    this.Failed = LiveEntities.Failed.bind(null, this);
    this.FailedAttempts = LiveEntities.FailedAttempts.bind(null, this);
    this.FinancialTransactions = LiveEntities.FinancialTransactions.bind(
      null,
      this,
    );
    this.History = LiveEntities.History.bind(null, this);
    this.Paid = LiveEntities.Paid.bind(null, this);
    this.Urls = LiveEntities.Urls.bind(null, this);
    this.Metadata = LiveEntities.Metadata.bind(null, this);
    this.OrderItems = LiveEntities.OrderItems.bind(null, this);
    this.PayeeInfo = LiveEntities.PayeeInfo.bind(null, this);
    this.Payer = LiveEntities.Payer.bind(null, this);
  }

  /**
   * Resolves the callback data by fetching the entities
   * from the Swedbank Pay endpoints.
   * @param data the callback data from Swedbank Pay
   * @returns the resolved objects, or null if not provided
   */
  async resolveCallback(data: responseData.Callback): Promise<{
    paymentOrder: LiveEntities.PaymentOrder | null;
  }> {
    const {
      paymentOrder: rawPaymentOrder,
      // payment: rawPayment, TODO: implement
      // transaction: rawTransaction, TODO: implement
    } = data;
    const paymentOrder =
      rawPaymentOrder == null
        ? null
        : await this.PaymentOrder.load(rawPaymentOrder.id);
    return {
      paymentOrder,
    };
  }

  /** The name of the merchant. */
  get merchantName() {
    return this._merchantName;
  }
}

export default SwedbankPayClient;
