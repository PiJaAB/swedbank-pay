import axios, { AxiosInstance } from 'axios';
import LiveEntities from './LiveEntities';
import { CallbackData, IntTypeMap } from './Types';
import * as Factories from './Factories';
import { integerMap } from './utils/IntegerMap';

export type Options<IntType extends keyof IntTypeMap> = {
  readonly integerType: IntType;
  readonly apiToken: string;
  readonly merchantId: string;
  readonly env: 'test' | 'prod';
  readonly merchantName?: string;
};

type BoundConstructor<
  Ctor extends {
    new (first: never, ...args: never[]): unknown;
    load(first: never, ...args: never[]): Promise<unknown>;
  },
> = Ctor extends {
  new (first: never, ...args: infer CArgs): InstanceType<Ctor>;
  load(first: never, ...args: infer LArgs): Promise<InstanceType<Ctor>>;
}
  ? {
      new (...args: CArgs): InstanceType<Ctor>;
      load(...args: LArgs): Promise<InstanceType<Ctor>>;
    }
  : never;

function bindLiveEntityConstructor<
  IntTypeName extends keyof IntTypeMap,
  Ctor extends typeof LiveEntities[keyof typeof LiveEntities],
>(
  client: SwedbankPayClient<IntTypeName>,
  ctor: Ctor,
): BoundConstructor<
  Extract<
    typeof ctor<SwedbankPayClient<IntTypeName>>,
    { prototype: InstanceType<Ctor> }
  >
> {
  const anyCtor = ctor as any;
  return Object.assign(anyCtor.bind(null, client), {
    load: anyCtor.load.bind(anyCtor, client),
  });
}

export class SwedbankPayClient<IntTypeName extends keyof IntTypeMap> {
  private static apiUrls = {
    test: 'https://api.externalintegration.payex.com',
    prod: 'https://api.payex.com',
  };

  /** Which number type to use for integers */
  readonly intType: IntTypeName;

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
    ): Factories.OrderItemFactory<IntTypeName>;
  };

  /** Bound version of the {@link Factories.PayerFactory PayerFactory} class with client constructor argument prepopulated */
  readonly PayerFactory: {
    new (options?: Factories.PayerFactoryOptions): Factories.PayerFactory;
  };

  /** Bound version of the {@link LiveEntities.PaymentOrder PaymentOrder} class with client constructor argument prepopulated */
  readonly PaymentOrder: BoundConstructor<
    typeof LiveEntities.PaymentOrder<SwedbankPayClient<IntTypeName>>
  >;

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
  }: Options<IntTypeName>) {
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
          ? [client: SwedbankPayClient<IntTypeName>, ...rest: Rest]
          : never
      ): LiveEntities.PaymentOrder<IntTypeName>;
      load(
        ...params: Parameters<
          typeof LiveEntities.PaymentOrder['load']
        > extends [SwedbankPayClient<keyof IntTypeMap>, ...infer Rest]
          ? [client: SwedbankPayClient<IntTypeName>, ...rest: Rest]
          : never
      ): Promise<LiveEntities.PaymentOrder<IntTypeName>>;
    };
    this.PaymentOrder = Object.assign(TypedPaymentOrder.bind(null, this), {
      load: TypedPaymentOrder.load.bind(LiveEntities.PaymentOrder, this),
    });
  }

  asIntType(num: IntTypeMap[keyof IntTypeMap]): NumberType<this> {
    return integerMap[this.intType](num) as NumberType<this>;
  }

  /**
   * Resolves the callback data by fetching the entities
   * from the Swedbank Pay endpoints.
   * @param data the callback data from Swedbank Pay
   * @returns the resolved objects, or null if not provided
   */
  async resolveCallback(data: CallbackData): Promise<{
    paymentOrder: LiveEntities.PaymentOrder<IntTypeName> | null;
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

type UnionToIntersection<Union> = (
  Union extends unknown ? (o: Union) => void : never
) extends (o: infer Q) => void
  ? Q
  : never;

export type IntersectionNumberType<
  Client extends SwedbankPayClient<keyof IntTypeMap>,
> = Client extends SwedbankPayClient<infer IntTypeName>
  ? UnionToIntersection<IntTypeMap[IntTypeName]>
  : never;

export type NumberType<Client extends SwedbankPayClient<keyof IntTypeMap>> =
  Client extends SwedbankPayClient<infer IntTypeName>
    ? UnionToIntersection<IntTypeMap[IntTypeName]>
    : never;

export default SwedbankPayClient;
