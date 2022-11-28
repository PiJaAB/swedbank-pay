import SwedbankPayClient from '../../SwedbankPayClient';
import {
  PaymentOrderOperation,
  PaymentResponse,
  PaymentState,
} from '../../Types';
import { ResponseEntity } from '../../Types/responseData';

const ID_PREFIX = '/psp/paymentorders/';

function getInstance<Class extends { id: string }>(
  client: SwedbankPayClient,
  ctor: new (client: SwedbankPayClient, id: string) => Class,
  id: string | null | undefined,
  existing: Class | null | undefined,
): Class | null {
  if (id == null) return null;
  if (id === existing?.id) return existing;
  return new ctor(client, id);
}

function paramData(
  data: PaymentResponse,
  client: SwedbankPayClient,
  existing?: Payment,
) {
  const { payment, operations } = data;
  return {
    id: payment.id,
    number: payment.number,
    created: new Date(payment.created),
    updated: new Date(payment.updated),
    instrument: payment.instrument,
    state: payment.state,
    operation: payment.operation ?? null,
    currency: payment.currency,
    amount: payment.amount,
    vatAmount: payment.vatAmount ?? null,
    remainingReversalAmount: payment.remainingReversalAmount ?? null,
    remainingCaptureAmount: payment.remainingCaptureAmount ?? null,
    remainingCancellationAmount: payment.remainingCancellationAmount ?? null,
    description: payment.description,
    payerReference: payment.payerReference ?? null,
    initiatingSystemUserAgent: payment.initiatingSystemUserAgent,
    userAgent: payment.userAgent,
    language: payment.language,
    recurrenceToken: payment.recurrenceToken ?? null,
    paymentToken: payment.paymentToken ?? null,
    prices: getInstance(client, Prices, payment.prices?.id, existing?.prices),
    cancelled:
      !existing || payment.cancelled.id !== existing.cancelled.id
        ? new Cancelled(client, payment.cancelled.id)
        : existing.cancelled,
    failed:
      !existing || payment.failed.id !== existing.failed.id
        ? new Failed(client, payment.failed.id)
        : existing.failed,
    failedAttempts:
      !existing || payment.failedAttempts.id !== existing.failedAttempts.id
        ? new FailedAttempts(client, payment.failedAttempts.id)
        : existing.failedAttempts,
    financialTransactions:
      !existing ||
      payment.financialTransactions.id !== existing.financialTransactions.id
        ? new FinancialTransactions(client, payment.financialTransactions.id)
        : existing.financialTransactions,
    history:
      !existing || payment.history.id !== existing.history.id
        ? new History(client, payment.history.id)
        : existing.history,
    metadata:
      !existing || payment.metadata.id !== existing.metadata.id
        ? new Metadata(client, payment.metadata.id)
        : existing.metadata,
    orderItems:
      !existing || payment.orderItems?.id !== existing.orderItems?.id
        ? (payment.orderItems &&
            new OrderItems(client, payment.orderItems.id)) ??
          null
        : existing.orderItems,
    paid:
      !existing || payment.paid.id !== existing.paid.id
        ? new Paid(client, payment.paid.id)
        : existing.paid,
    payeeInfo:
      !existing || payment.payeeInfo.id !== existing.payeeInfo.id
        ? new PayeeInfo(client, payment.payeeInfo.id)
        : existing.payeeInfo,
    payer:
      !existing || payment.payer?.id !== existing.payer?.id
        ? (payment.payer && new Payer(client, payment.payer.id)) ?? null
        : existing.payer,
    urls:
      !existing || payment.urls.id !== existing.urls.id
        ? new Urls(client, payment.urls.id)
        : existing.urls,
    operations: operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key: string]: ResponseEntity.OperationEntity | undefined }),
  };
}

export default class Payment {
  readonly id: string;
  readonly number: number;
  readonly created: Date;
  readonly updated: Date;
  readonly instrument: string;
  readonly state: PaymentState;
  readonly operation: PaymentOrderOperation | null;
  readonly currency: string;
  readonly amount: number;
  readonly vatAmount: number | null;
  readonly remainingReversalAmount: number | null;
  readonly remainingCaptureAmount: number | null;
  readonly remainingCancellationAmount: number | null;
  readonly description: string;
  readonly payerReference: string | null;
  readonly initiatingSystemUserAgent: string;
  readonly userAgent: string;
  readonly language: string;
  readonly recurrenceToken: string | null;
  readonly paymentToken: string | null;

  readonly operations: {
    [key: string]: ResponseEntity.OperationEntity | undefined;
  };

  private _inFlight: Promise<this> | null = null;

  readonly prices: Prices;
  readonly cancelled: Cancelled;
  readonly failed: Failed;
  readonly failedAttempts: FailedAttempts;
  readonly financialTransactions: FinancialTransactions;
  readonly history: History;
  readonly metadata: Metadata;
  readonly orderItems: OrderItems | null;
  readonly paid: Paid;
  readonly payeeInfo: PayeeInfo;
  readonly payer: Payer | null;
  readonly urls: Urls;

  readonly lastFetched: Date;

  readonly client: SwedbankPayClient;

  constructor(
    client: SwedbankPayClient,
    options: PaymentResponse,
    fetched: Date,
  ) {
    const data = paramData(options, client);
    this.id = data.id;
    this.number = data.number;
    this.created = data.created;
    this.updated = data.updated;
    this.instrument = data.instrument;
    this.state = data.state;
    this.operation = data.operation;
    this.currency = data.currency;
    this.amount = data.amount;
    this.vatAmount = data.vatAmount;
    this.remainingReversalAmount = data.remainingReversalAmount;
    this.remainingCaptureAmount = data.remainingCaptureAmount;
    this.remainingCancellationAmount = data.remainingCancellationAmount;
    this.description = data.description;
    this.payerReference = data.payerReference;
    this.initiatingSystemUserAgent = data.initiatingSystemUserAgent;
    this.userAgent = data.userAgent;
    this.language = data.language;
    this.recurrenceToken = data.recurrenceToken;
    this.paymentToken = data.paymentToken;

    this.prices = data.prices;
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
    this.operations = data.operations;

    this.lastFetched = fetched;
    this.client = client;
  }

  static async load(client: SwedbankPayClient, id: string) {
    if (!id.startsWith('/')) {
      id = `${ID_PREFIX}${id}`;
    }
    const res = await client.axios.get<PaymentResponse>(id);
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
      orderItem: responseData.OrderItemListEntry,
      index: number,
      list: ReadonlyArray<responseData.OrderItemListEntry>,
    ) =>
      | responseData.OrderItemListEntry
      | null
      | PromiseLike<responseData.OrderItemListEntry | null>,
  ) {
    const captureOperation =
      this.operations.capture ??
      (await this.refresh().then(
        ({ operations }) => operations.capture ?? null,
      ));
    if (captureOperation == null) {
      throw new Error('No capture operation available');
    }
    let orderItems = await this.orderItems?.getOrderItemList();
    if (orderItems != null && orderItems.length === 0) orderItems = undefined;
    orderItems =
      orderItems && mapper != null
        ? await Promise.all(orderItems.map(mapper)).then((list) =>
            list.filter((e): e is responseData.OrderItemListEntry => e != null),
          )
        : orderItems;
    let transaction: {
      description: string;
      amount: number;
      vatAmount: number;
      payeeReference: string;
      receiptReference: string | undefined;
      orderItems?: readonly OrderItemListEntry[];
    };
    if (orderItems != null) {
      if (orderItems.length === 0) {
        throw new Error('Need to include at least one order item if specified');
      }
      const [amount, vatAmount] = orderItems
        .reduce(
          (acc, cur) => {
            acc[0] += BigInt(cur.amount);
            acc[1] += BigInt(cur.vatAmount);
            return acc;
          },
          [0n, 0n],
        )
        .map((e) => Number(e));
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
      .patch<PaymentResponse>(abortOpreation.href, {
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

  private assignResponseData(resData: PaymentResponse) {
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
        .get<PaymentResponse>(this.id)
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
