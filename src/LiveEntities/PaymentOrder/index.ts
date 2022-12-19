import SwedbankPayClient from '../../SwedbankPayClient';
import {
  IntTypeMap,
  PaymentOrderOperation,
  PaymentOrderResponse,
  ResponseEntity,
} from '../../Types';
import { integerMap } from '../../utils/IntegerMap';
import PaymentOrderSubEntity from './PaymentOrderSubEntity';

const ID_PREFIX = '/psp/paymentorders/';

type SubEntityKey = {
  [Key in keyof PaymentOrder<keyof IntTypeMap>]-?: PaymentOrder<
    keyof IntTypeMap
  >[Key] extends PaymentOrderSubEntity<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[keyof PaymentOrder<keyof IntTypeMap>];

type SimpleAccessKey = {
  [Key in SubEntityKey]: PaymentOrder<
    keyof IntTypeMap
  >[Key] extends PaymentOrderSubEntity<
    Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[SubEntityKey];

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type LastOf<T> = UnionToIntersection<
  T extends unknown ? () => T : never
> extends () => infer R
  ? R
  : never;

function getInstance<
  Key extends SimpleAccessKey,
  IntType extends keyof IntTypeMap,
>(
  client: SwedbankPayClient<IntType>,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  existingOrder?: PaymentOrder<IntType>,
): PaymentOrder<IntType>[Key];
function getInstance<
  Key extends SubEntityKey,
  IntType extends keyof IntTypeMap,
>(
  client: SwedbankPayClient<IntType>,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  dataAccessKey: PaymentOrder<IntType>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentOrderSubEntity<infer AccessKey, any>
    | undefined
    | null
    ? AccessKey
    : never,
  existingOrder?: PaymentOrder<IntType>,
): PaymentOrder<IntType>[Key];
function getInstance<Key extends SubEntityKey>(
  client: SwedbankPayClient<keyof IntTypeMap>,
  data: PaymentOrderResponse['paymentOrder'],
  key: Key,
  dataAccessKeyOrExisting:
    | (PaymentOrder<keyof IntTypeMap>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | PaymentOrderSubEntity<infer AccessKey, any>
        | undefined
        | null
        ? AccessKey
        : never)
    | PaymentOrder<keyof IntTypeMap>
    | undefined,
  existingOrder?: PaymentOrder<keyof IntTypeMap>,
): PaymentOrder<keyof IntTypeMap>[Key] {
  let dataAccessKey: PaymentOrder<keyof IntTypeMap>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  if (id == null) return null as PaymentOrder<keyof IntTypeMap>[Key];
  if (id === existingValue?.id) return existingValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PaymentOrderSubEntity<any, any>(
    client,
    dataAccessKey,
    id,
  ) as PaymentOrder<keyof IntTypeMap>[Key];
}

function paramData<IntType extends keyof IntTypeMap>(
  data: PaymentOrderResponse,
  client: SwedbankPayClient<IntType>,
  existing?: PaymentOrder<IntType>,
) {
  const { paymentOrder: po, operations } = data;
  return {
    id: po.id,
    operation: po.operation,
    status: po.status,
    created: new Date(po.created),
    updated: new Date(po.updated),
    amount: po.amount,
    vatAmount: po.vatAmount,
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
    remainingReversalAmount: po.remainingReversalAmount ?? null,
    remainingCaptureAmount: po.remainingCaptureAmount ?? null,
    remainingCancellationAmount: po.remainingCancellationAmount ?? null,
    operations: operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key: string]: ResponseEntity.OperationEntity | undefined }),
  };
}

export default class PaymentOrder<IntTypeName extends keyof IntTypeMap> {
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
  readonly amount: number;
  readonly vatAmount: number;
  readonly description: string;
  readonly initiatingSystemUserAgent: string;
  readonly language: string;
  readonly availableInstruments: string[];
  readonly implementation: string;
  readonly integration: string;
  readonly instrumentMode: boolean;
  readonly guestMode: boolean;
  readonly remainingReversalAmount: number | null;
  readonly remainingCaptureAmount: number | null;
  readonly remainingCancellationAmount: number | null;

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

  readonly client: SwedbankPayClient<IntTypeName>;

  constructor(
    client: SwedbankPayClient<IntTypeName>,
    options: PaymentOrderResponse,
    fetched: Date,
  ) {
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
      orderItem: ResponseEntity.OrderItemEntity<IntTypeName>,
      index: number,
      list: ReadonlyArray<ResponseEntity.OrderItemEntity<IntTypeName>>,
    ) =>
      | ResponseEntity.OrderItemEntity<IntTypeName>
      | null
      | PromiseLike<ResponseEntity.OrderItemEntity<IntTypeName> | null>,
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
        ? await Promise.all(
            (this.client.intType === 'number'
              ? (orderItems as ResponseEntity.OrderItemEntity<IntTypeName>[])
              : orderItems.map(
                  ({
                    amount,
                    discountPrice,
                    quantity,
                    unitPrice,
                    vatAmount,
                    vatPercent,
                    ...rest
                  }): ResponseEntity.OrderItemEntity<IntTypeName> => ({
                    ...rest,
                    amount: integerMap[this.client.intType](amount),
                    discountPrice:
                      integerMap[this.client.intType](discountPrice),
                    quantity: integerMap[this.client.intType](quantity),
                    unitPrice: integerMap[this.client.intType](unitPrice),
                    vatAmount: integerMap[this.client.intType](vatAmount),
                    vatPercent: integerMap[this.client.intType](vatPercent),
                  }),
                )
            ).map(mapper),
          ).then((list) =>
            list.filter(
              (e): e is ResponseEntity.OrderItemEntity<IntTypeName> =>
                e != null,
            ),
          )
        : orderItems;
    let transaction: {
      description: string;
      amount: number;
      vatAmount: number;
      payeeReference: string;
      receiptReference: string | undefined;
      orderItems?: readonly ResponseEntity.OrderItemEntity<IntTypeName>[];
    };
    if (orderItems != null) {
      if (orderItems.length === 0) {
        throw new Error('Need to include at least one order item if specified');
      }
      const [amount, vatAmount] = orderItems
        .reduce<[number, number]>(
          (acc: [number, number], cur) => {
            acc[0] += integerMap[this.client.intType](
              cur.amount,
            ) as typeof acc[0];
            acc[1] += integerMap[this.client.intType](
              cur.vatAmount,
            ) as typeof acc[1];
            return acc;
          },
          [
            integerMap[this.client.intType](0),
            integerMap[this.client.intType](0),
          ] as [number, number],
        )
        .map((e) => Number(e)) as [
        IntTypeMap[IntTypeName],
        IntTypeMap[IntTypeName],
      ];
      transaction = {
        description,
        amount,
        vatAmount,
        payeeReference,
        receiptReference,
        orderItems,
      };
    } else {
      const amount = this.remainingCaptureAmount ?? this.amount;
      const alreadyCapturedAmount = this.amount - amount;
      const vatAmount =
        alreadyCapturedAmount === 0
          ? this.vatAmount
          : Math.round(amount * (this.vatAmount / this.amount));
      transaction = {
        description,
        amount,
        vatAmount,
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
