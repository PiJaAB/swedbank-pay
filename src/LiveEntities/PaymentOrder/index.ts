import SwedbankPayClient, { NumberType } from '../../SwedbankPayClient';
import {
  IntTypeMap,
  PaymentOrderOperation,
  PaymentOrderResponse,
  ResponseEntity,
} from '../../Types';
import PaymentOrderSubEntity from './PaymentOrderSubEntity';

const ID_PREFIX = '/psp/paymentorders/';

type SubEntityKey = {
  [Key in keyof PaymentOrder<SwedbankPayClient<never>>]-?: PaymentOrder<
    SwedbankPayClient<never>
  >[Key] extends PaymentOrderSubEntity<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[keyof PaymentOrder<SwedbankPayClient<never>>];

type SimpleAccessKey = {
  [Key in SubEntityKey]: PaymentOrder<
    SwedbankPayClient<never>
  >[Key] extends PaymentOrderSubEntity<
    Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[SubEntityKey];

function getInstance<
  Key extends SimpleAccessKey,
  Client extends SwedbankPayClient<keyof IntTypeMap>,
>(
  client: Client,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  existingOrder?: PaymentOrder<Client>,
): PaymentOrder<Client>[Key];
function getInstance<
  Key extends SubEntityKey,
  Client extends SwedbankPayClient<keyof IntTypeMap>,
>(
  client: Client,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  dataAccessKey: PaymentOrder<Client>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentOrderSubEntity<infer AccessKey, any>
    | undefined
    | null
    ? AccessKey
    : never,
  existingOrder?: PaymentOrder<Client>,
): PaymentOrder<Client>[Key];
function getInstance<Key extends SubEntityKey>(
  client: SwedbankPayClient<never>,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  dataAccessKeyOrExisting:
    | (PaymentOrder<SwedbankPayClient<never>>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | PaymentOrderSubEntity<infer AccessKey, any>
        | undefined
        | null
        ? AccessKey
        : never)
    | PaymentOrder<SwedbankPayClient<never>>
    | undefined,
  existingOrder?: PaymentOrder<SwedbankPayClient<never>>,
): PaymentOrder<SwedbankPayClient<never>>[Key] {
  let dataAccessKey: PaymentOrder<SwedbankPayClient<never>>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentOrderSubEntity<infer AccessKey, any>
    | undefined
    | null
    ? AccessKey
    : never;
  if (
    typeof dataAccessKeyOrExisting !== 'object' &&
    dataAccessKeyOrExisting !== undefined
  ) {
    dataAccessKey = dataAccessKeyOrExisting;
  } else {
    dataAccessKey = key as string | symbol | number as typeof dataAccessKey;
  }
  if (typeof dataAccessKeyOrExisting === 'object') {
    existingOrder = dataAccessKeyOrExisting;
  }
  const existingValue = existingOrder?.[key];
  const id = data[key]?.id;
  if (id == null) return null as PaymentOrder<SwedbankPayClient<never>>[Key];
  if (id === existingValue?.id) return existingValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PaymentOrderSubEntity<any, any>(
    client,
    dataAccessKey,
    id,
  ) as PaymentOrder<SwedbankPayClient<never>>[Key];
}

function paramData<Client extends SwedbankPayClient<keyof IntTypeMap>>(
  data: PaymentOrderResponse,
  client: Client,
  existing?: PaymentOrder<Client>,
) {
  const { paymentOrder: po, operations } = data;
  return {
    id: po.id,
    operation: po.operation,
    status: po.status,
    created: new Date(po.created),
    updated: new Date(po.updated),
    amount: client.asIntType(po.amount),
    vatAmount: client.asIntType(po.vatAmount),
    description: po.description,
    initiatingSystemUserAgent: po.initiatingSystemUserAgent,
    language: po.language,
    availableInstruments: [...po.availableInstruments],
    implementation: po.implementation,
    integration: po.integration,
    instrumentMode: po.instrumentMode,
    guestMode: po.guestMode,
    aborted: getInstance(client, po, 'aborted', existing),
    cancelled: getInstance(client, po, 'cancelled', existing),
    failed: getInstance(client, po, 'failed', existing),
    failedAttempts: getInstance(client, po, 'failedAttempts', existing),
    financialTransactions: getInstance(
      client,
      po,
      'financialTransactions',
      existing,
    ),
    history: getInstance(client, po, 'history', existing),
    metadata: getInstance(client, po, 'metadata', existing),
    orderItems: getInstance(client, po, 'orderItems', existing),
    paid: getInstance(client, po, 'paid', existing),
    payeeInfo: getInstance(client, po, 'payeeInfo', existing),
    payer: getInstance(client, po, 'payer', existing),
    urls: getInstance(client, po, 'urls', existing),
    remainingReversalAmount:
      client.asIntType(po.remainingReversalAmount) ?? null,
    remainingCaptureAmount: client.asIntType(po.remainingCaptureAmount) ?? null,
    remainingCancellationAmount:
      client.asIntType(po.remainingCancellationAmount) ?? null,
    operations: operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key: string]: ResponseEntity.OperationEntity | undefined }),
  };
}

export default class PaymentOrder<
  Client extends SwedbankPayClient<keyof IntTypeMap>,
> {
  readonly id: string;
  readonly operation: PaymentOrderOperation;
  readonly status:
    | 'Initialized'
    | 'Ready'
    | 'Pending'
    | 'Paid'
    | 'Failed'
    | 'Aborted';
  readonly created: Date;
  readonly updated: Date;
  readonly amount: NumberType<Client>;
  readonly vatAmount: NumberType<Client>;
  readonly description: string;
  readonly initiatingSystemUserAgent: string;
  readonly language: string;
  readonly availableInstruments: string[];
  readonly implementation: string;
  readonly integration: string;
  readonly instrumentMode: boolean;
  readonly guestMode: boolean;
  readonly remainingReversalAmount: NumberType<Client> | null;
  readonly remainingCaptureAmount: NumberType<Client> | null;
  readonly remainingCancellationAmount: NumberType<Client> | null;

  readonly operations: {
    [key: string]: ResponseEntity.OperationEntity | undefined;
  };

  private _inFlight: Promise<this> | null = null;

  readonly aborted: PaymentOrderSubEntity<
    'aborted',
    PaymentOrderResponse.Aborted
  >;
  readonly cancelled: PaymentOrderSubEntity<
    'cancelled',
    PaymentOrderResponse.Cancelled
  >;
  readonly failed: PaymentOrderSubEntity<'failed', PaymentOrderResponse.Failed>;
  readonly failedAttempts: PaymentOrderSubEntity<
    'failedAttempts',
    PaymentOrderResponse.FailedAttempts
  >;
  readonly financialTransactions: PaymentOrderSubEntity<
    'financialTransactions',
    PaymentOrderResponse.FinancialTransactions
  >;
  readonly history: PaymentOrderSubEntity<
    'history',
    PaymentOrderResponse.History
  >;
  readonly metadata: PaymentOrderSubEntity<
    'metadata',
    PaymentOrderResponse.Metadata
  >;
  readonly orderItems: PaymentOrderSubEntity<
    'orderItems',
    PaymentOrderResponse.OrderItems
  > | null;
  readonly paid: PaymentOrderSubEntity<'paid', PaymentOrderResponse.Paid>;
  readonly payeeInfo: PaymentOrderSubEntity<
    'payeeInfo',
    PaymentOrderResponse.PayeeInfo
  >;
  readonly payer: PaymentOrderSubEntity<
    'payer',
    PaymentOrderResponse.Payer
  > | null;
  readonly urls: PaymentOrderSubEntity<'urls', PaymentOrderResponse.URLs>;

  readonly lastFetched: Date;

  readonly client: Client;

  constructor(client: Client, options: PaymentOrderResponse, fetched: Date) {
    const data = paramData(options, client);
    this.id = data.id;
    this.operation = data.operation;
    this.status = data.status;
    this.created = data.created;
    this.updated = data.updated;
    this.amount = data.amount;
    this.vatAmount = data.vatAmount;
    this.description = data.description;
    this.initiatingSystemUserAgent = data.initiatingSystemUserAgent;
    this.language = data.language;
    this.availableInstruments = data.availableInstruments;
    this.implementation = data.implementation;
    this.integration = data.integration;
    this.instrumentMode = data.instrumentMode;
    this.guestMode = data.guestMode;
    this.aborted = data.aborted;
    this.cancelled = data.cancelled;
    this.failed = data.failed;
    this.failedAttempts = data.failedAttempts;
    this.financialTransactions = data.financialTransactions;
    this.history = data.history;
    this.metadata = data.metadata;
    this.orderItems = data.orderItems;
    this.paid = data.paid;
    this.payeeInfo = data.payeeInfo;
    this.payer = data.payer;
    this.urls = data.urls;
    this.remainingReversalAmount = data.remainingReversalAmount;
    this.remainingCaptureAmount = data.remainingCaptureAmount;
    this.remainingCancellationAmount = data.remainingCancellationAmount;
    this.operations = data.operations;
    this.lastFetched = fetched;

    this.client = client;
  }

  static async load<IntType extends keyof IntTypeMap>(
    client: SwedbankPayClient<IntType>,
    id: string,
  ) {
    if (!id.startsWith('/')) {
      id = `${ID_PREFIX}${id}`;
    }
    const res = await client.axios.get<PaymentOrderResponse>(id);
    return new this(client, res.data, new Date());
  }

  /**
   * Whether this paymentOrder is paid and captured in full.
   */
  get fullyCaptured() {
    return this.status === 'Paid' && !this.remainingCaptureAmount;
  }

  /**
   * Private function to unionize the number types.
   * It actually ensures the type from client, but we type it
   * as bigint to make it possible to use numerical operators.
   *
   * @param num The number to convert to the type configured by the client
   * @returns The number, in the type configured by the client, but typed as bigint from typescirpt
   * @private
   */
  private toNum(num: IntTypeMap[keyof IntTypeMap]): bigint;
  private toNum(num: IntTypeMap[keyof IntTypeMap] | null): bigint | null;
  private toNum(
    num: IntTypeMap[keyof IntTypeMap] | undefined,
  ): bigint | undefined;
  private toNum(
    num: IntTypeMap[keyof IntTypeMap] | null | undefined,
  ): bigint | null | undefined;
  private toNum(num: IntTypeMap[keyof IntTypeMap] | null | undefined) {
    return this.toNum(num) as bigint;
  }

  async capture(
    {
      description,
      payeeReference,
      receiptReference,
    }: {
      description: string;
      payeeReference: string;
      receiptReference?: string;
    },
    mapper?: (
      orderItem: ResponseEntity.OrderItemEntity,
      index: number,
      list: ReadonlyArray<ResponseEntity.OrderItemEntity>,
    ) =>
      | ResponseEntity.OrderItemEntity
      | null
      | PromiseLike<ResponseEntity.OrderItemEntity | null>,
  ) {
    const captureOperation =
      this.operations.capture ??
      (await this.refresh().then(
        ({ operations }) => operations.capture ?? null,
      ));
    if (captureOperation == null) {
      throw new Error('No capture operation available');
    }
    let orderItems = await this.orderItems?.get('orderItemList');
    if (orderItems != null && orderItems.length === 0) orderItems = undefined;
    orderItems =
      orderItems && mapper != null
        ? await Promise.all(orderItems.map(mapper)).then((list) =>
            list.filter((e): e is ResponseEntity.OrderItemEntity => e != null),
          )
        : orderItems;
    let transaction: {
      description: string;
      amount: number;
      vatAmount: number;
      payeeReference: string;
      receiptReference: string | undefined;
      orderItems?: readonly ResponseEntity.OrderItemEntity[];
    };
    if (orderItems != null) {
      if (orderItems.length === 0) {
        throw new Error('Need to include at least one order item if specified');
      }
      const [amount, vatAmount] = orderItems.reduce<[number, number]>(
        (acc: [number, number], cur) => {
          acc[0] += cur.amount;
          acc[1] += cur.vatAmount;
          return acc;
        },
        [0, 0],
      );
      transaction = {
        description,
        amount,
        vatAmount,
        payeeReference,
        receiptReference,
        orderItems,
      };
    } else {
      const amount = this.toNum(this.remainingCaptureAmount ?? this.amount);
      const alreadyCapturedAmount = this.toNum(this.amount - amount);
      const vatAmount =
        alreadyCapturedAmount === this.toNum(0)
          ? this.toNum(this.vatAmount)
          : amount * (this.toNum(this.vatAmount) / this.toNum(this.amount));
      transaction = {
        description,
        amount:
          typeof amount === 'number' ? Math.round(amount) : Number(amount),
        vatAmount:
          typeof vatAmount === 'number'
            ? Math.round(vatAmount)
            : Number(vatAmount),
        payeeReference,
        receiptReference,
      };
    }
    return this.client.axios
      .post(captureOperation.href, {
        transaction,
      })
      .then(() => this.refresh(true).catch(() => this));
  }

  async abort(abortReason: 'CancelledByConsumer' | 'CancelledByCustomer') {
    const abortOpreation =
      this.operations.abort ??
      (await this.refresh().then(({ operations }) => operations.abort ?? null));
    if (abortOpreation == null) {
      throw new Error('No abort operation available');
    }
    const paymentOrder = {
      operation: abortOpreation.rel,
      abortReason,
    };
    const promise = this.client.axios
      .patch<PaymentOrderResponse>(abortOpreation.href, {
        paymentOrder,
      })
      .then((res): this | PromiseLike<this> => {
        if (this._inFlight === promise) {
          this._inFlight = null;
          this.assignResponseData(res.data);
          return this;
        } else if (this._inFlight != null) {
          return this._inFlight;
        }
        return this;
      })
      .finally(() => {
        if (this._inFlight === promise) {
          this._inFlight = null;
        }
      });
    this._inFlight = promise.catch(() => this.refresh());
    return promise;
  }

  async cancel({
    description,
    payeeReference,
  }: {
    description: string;
    payeeReference: string;
  }) {
    const cancelOperation =
      this.operations.cancel ??
      (await this.refresh().then(
        ({ operations }) => operations.cancel ?? null,
      ));
    if (cancelOperation == null) {
      throw new Error('No capture operation available');
    }
    const transaction = {
      description,
      payeeReference,
    };
    return this.client.axios
      .post(cancelOperation.href, {
        transaction,
      })
      .then(() => this.refresh(true).catch(() => this));
  }

  private assignResponseData(resData: PaymentOrderResponse) {
    Object.assign(this, paramData(resData, this.client, this));
  }

  /**
   * Fetch fresh data from SwedbankPay
   * @param force Force a new request, supersceeding any in-flight requests.
   * @returns A reference to the instance for chaining.
   */
  refresh(force?: boolean) {
    if (force || this._inFlight == null) {
      const promise = this.client.axios
        .get<PaymentOrderResponse>(this.id)
        .then((res): this | PromiseLike<this> => {
          if (this._inFlight === promise) {
            this._inFlight = null;
            this.assignResponseData(res.data);
            Object.assign(this, { lastFetched: new Date() });
            return this;
          } else if (this._inFlight != null) {
            return this._inFlight;
          }
          return this;
        })
        .finally(() => {
          if (this._inFlight === promise) {
            this._inFlight = null;
          }
        });
      this._inFlight = promise;
    }
    return this._inFlight;
  }

  /**
   * Due to an oddity in the SwedbankPay API, this getter is required to
   * deduce whether the payment is already aborted by checking for the
   * presence of the `abort´ operation.
   */
  get isAborted() {
    return (
      this.status === 'Aborted' ||
      (this.operations.abort == null && this.status === 'Initialized')
    );
  }
}
