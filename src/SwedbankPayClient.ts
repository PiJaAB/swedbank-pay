import axios, { AxiosInstance } from 'axios';
import * as LiveEntities from './LiveEntities';
import { PaymentOrderResponse, CallbackData, IntTypeMap } from './Types';
import * as Factories from './Factories';
import { integerMap } from './utils/IntegerMap';

export type Options<IntType extends keyof IntTypeMap> = {
  readonly integerType: IntType;
  readonly apiToken: string;
  readonly merchantId: string;
  readonly env: 'test' | 'prod';
  readonly merchantName?: string;
};

export class SwedbankPayClient<IntType extends keyof IntTypeMap> {
  private static apiUrls = {
    test: 'https://api.externalintegration.payex.com',
    prod: 'https://api.payex.com',
  };

  /** Which number type to use for integers */
  readonly intType: IntType;

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
      options: PaymentOrderResponse,
      fetched: Date,
    ): LiveEntities.PaymentOrder<IntType>;
    /** Load a payment order from the backend using a specific ID */
    load(id: string): Promise<LiveEntities.PaymentOrder<IntType>>;
  };

  /**
   * Creates a new SwedbankPayClient instance.
   * @param options the options for the client
   * @param options.apiToken the API token for the client
   * @param options.merchantId the merchant ID for the client
   * @param options.env the environment to use for the client
   */
  constructor({
    apiToken,
    merchantId,
    env,
    merchantName,
    integerType,
  }: Options<IntType>) {
    if (integerMap[integerType] === undefined) {
      throw new Error(
        `Invalid number type: ${integerType}, it may not be supported on this platform.`,
      );
    } else if (typeof integerMap[integerType](0) !== integerType) {
      throw new Error(
        `Invalid number type: ${integerType}, it may not be supported on this platform. Polyfill detected and used: ${
          integerMap[integerType].name
        }, typeof does not match, got: ${typeof integerMap[integerType](
          0,
        )}, expected: ${integerType}`,
      );
    }
    this.intType = integerType;
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
    const TypedPaymentOrder = LiveEntities.PaymentOrder as {
      new (
        ...params: ConstructorParameters<
          typeof LiveEntities.PaymentOrder
        > extends [SwedbankPayClient<keyof IntTypeMap>, ...infer Rest]
          ? [client: SwedbankPayClient<IntType>, ...rest: Rest]
          : never
      ): LiveEntities.PaymentOrder<IntType>;
      load(
        ...params: Parameters<
          typeof LiveEntities.PaymentOrder['load']
        > extends [SwedbankPayClient<keyof IntTypeMap>, ...infer Rest]
          ? [client: SwedbankPayClient<IntType>, ...rest: Rest]
          : never
      ): Promise<LiveEntities.PaymentOrder<IntType>>;
    };
    this.PaymentOrder = Object.assign(TypedPaymentOrder.bind(null, this), {
      load: TypedPaymentOrder.load.bind(LiveEntities.PaymentOrder, this),
    });
  }

  asNumType(num: IntTypeMap[keyof IntTypeMap]): IntTypeMap[IntType] {
    return integerMap[this.intType](num) as IntTypeMap[IntType];
  }

  /**
   * Resolves the callback data by fetching the entities
   * from the Swedbank Pay endpoints.
   * @param data the callback data from Swedbank Pay
   * @returns the resolved objects, or null if not provided
   */
  async resolveCallback(data: CallbackData): Promise<{
    paymentOrder: LiveEntities.PaymentOrder<IntType> | null;
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
