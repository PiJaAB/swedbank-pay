import SwedbankPayClient from '../../SwedbankPayClient';
import { responseData } from '../../Types';
import Aborted from './Aborted';
import Cancelled from './Cancelled';
import Failed from './Failed';
import FailedAttempts from './FailedAttempts';
import FinancialTransactions from './FinancialTransactions';
import History from './History';
import Metadata from './Metadata';
import OrderItems from './OrderItems';
import Paid from './Paid';
import PayeeInfo from './PayeeInfo';
import Payer from './Payer';
import Urls from './Urls';

const ID_PREFIX = '/psp/paymentorders/';

export default class PaymentOrder {
  readonly id: string;
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
  readonly remainingCaptureAmaunt: number | null;
  readonly remainingCancellationAmount: number | null;

  readonly operations: {
    [key in responseData.PaymentOrderOperationEntity['rel']]?: responseData.PaymentOrderOperationEntity;
  };

  private _inFlight: Promise<this> | null = null;

  readonly aborted: Aborted;
  readonly cancelled: Cancelled;
  readonly failed: Failed;
  readonly failedAttempts: FailedAttempts;
  readonly financialTransactions: FinancialTransactions;
  readonly history: History;
  readonly metadata: Metadata;
  readonly orderItems: OrderItems;
  readonly paid: Paid;
  readonly payeeInfo: PayeeInfo;
  readonly payer: Payer;
  readonly urls: Urls;

  readonly lastFetched: Date;

  readonly client: SwedbankPayClient;

  constructor(
    client: SwedbankPayClient,
    options: responseData.PaymentOrderResponse,
    fetched: Date,
  ) {
    const { paymentOrder, operations } = options;
    this.id = paymentOrder.id;
    this.status = paymentOrder.status;
    this.created = new Date(paymentOrder.created);
    this.updated = new Date(paymentOrder.updated);
    this.amount = paymentOrder.amount;
    this.vatAmount = paymentOrder.vatAmount;
    this.description = paymentOrder.description;
    this.initiatingSystemUserAgent = paymentOrder.initiatingSystemUserAgent;
    this.language = paymentOrder.language;
    this.availableInstruments = [...paymentOrder.availableInstruments];
    this.implementation = paymentOrder.implementation;
    this.integration = paymentOrder.integration;
    this.instrumentMode = paymentOrder.instrumentMode;
    this.guestMode = paymentOrder.guestMode;
    this.aborted = new Aborted(client, paymentOrder.aborted.id);
    this.cancelled = new Cancelled(client, paymentOrder.cancelled.id);
    this.failed = new Failed(client, paymentOrder.failed.id);
    this.failedAttempts = new FailedAttempts(
      client,
      paymentOrder.failedAttempts.id,
    );
    this.financialTransactions = new FinancialTransactions(
      client,
      paymentOrder.financialTransactions.id,
    );
    this.history = new History(client, paymentOrder.history.id);
    this.metadata = new Metadata(client, paymentOrder.metadata.id);
    this.orderItems = new OrderItems(client, paymentOrder.orderItems.id);
    this.paid = new Paid(client, paymentOrder.paid.id);
    this.payeeInfo = new PayeeInfo(client, paymentOrder.payeeInfo.id);
    this.payer = new Payer(client, paymentOrder.payer.id);
    this.urls = new Urls(client, paymentOrder.urls.id);
    this.remainingReversalAmount = paymentOrder.remainingReversalAmount ?? null;
    this.remainingCaptureAmaunt = paymentOrder.remainingCaptureAmaunt ?? null;
    this.remainingCancellationAmount =
      paymentOrder.remainingCancellationAmount ?? null;
    this.operations = operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key in responseData.PaymentOrderOperationEntity['rel']]: responseData.PaymentOrderOperationEntity });
    this.lastFetched = fetched;

    this.client = client;
  }

  static async load(client: SwedbankPayClient, id: string) {
    if (!id.startsWith(ID_PREFIX)) {
      id = `${ID_PREFIX}${id}`;
    }
    const res = await client.axios.get<responseData.PaymentOrderResponse>(id);
    console.log(res.data);
    return new this(client, res.data, new Date());
  }

  /**
   * Whether this paymentOrder is paid and captured in full.
   */
  get fullyCaptured() {
    return this.status === 'Paid' && !this.remainingCaptureAmaunt;
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
    const allItems = await this.orderItems.getOrderItemList();
    const orderItems =
      mapper != null
        ? await Promise.all(allItems.map(mapper)).then((list) =>
            list.filter((e): e is responseData.OrderItemListEntry => e != null),
          )
        : allItems;
    if (orderItems.length === 0) {
      throw new Error('Need to include at least one order item');
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
    const transaction = {
      description,
      amount,
      vatAmount,
      payeeReference,
      receiptReference,
      orderItems,
    };
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
      .patch<responseData.PaymentOrderResponse>(abortOpreation.href, {
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

  private assignResponseData(resData: responseData.PaymentOrderResponse) {
    const { paymentOrder, operations } = resData;
    Object.assign(this, {
      id: paymentOrder.id,
      created: new Date(paymentOrder.created),
      updated: new Date(paymentOrder.updated),
      amount: paymentOrder.amount,
      vatAmount: paymentOrder.vatAmount,
      description: paymentOrder.description,
      initiatingSystemUserAgent: paymentOrder.initiatingSystemUserAgent,
      language: paymentOrder.language,
      remainingReversalAmount: paymentOrder.remainingReversalAmount ?? null,
      remainingCaptureAmaunt: paymentOrder.remainingCaptureAmaunt ?? null,
      remainingCancellationAmount:
        paymentOrder.remainingCancellationAmount ?? null,
      availableInstruments: [...paymentOrder.availableInstruments],
      implementation: paymentOrder.implementation,
      integration: paymentOrder.integration,
      instrumentMode: paymentOrder.instrumentMode,
      guestMode: paymentOrder.guestMode,
      aborted:
        paymentOrder.aborted.id !== this.aborted.id
          ? new Aborted(this.client, paymentOrder.aborted.id)
          : this.aborted,
      cancelled:
        paymentOrder.cancelled.id !== this.cancelled.id
          ? new Cancelled(this.client, paymentOrder.cancelled.id)
          : this.cancelled,
      failed:
        paymentOrder.failed.id !== this.failed.id
          ? new Failed(this.client, paymentOrder.failed.id)
          : this.failed,
      failedAttempts:
        paymentOrder.failedAttempts.id !== this.failedAttempts.id
          ? new FailedAttempts(this.client, paymentOrder.failedAttempts.id)
          : this.failedAttempts,
      financialTransactions:
        paymentOrder.financialTransactions.id !== this.financialTransactions.id
          ? new FinancialTransactions(
              this.client,
              paymentOrder.financialTransactions.id,
            )
          : this.financialTransactions,
      history:
        paymentOrder.history.id !== this.history.id
          ? new History(this.client, paymentOrder.history.id)
          : this.history,
      metadata:
        paymentOrder.metadata.id !== this.metadata.id
          ? new Metadata(this.client, paymentOrder.metadata.id)
          : this.metadata,
      orderItems:
        paymentOrder.orderItems.id !== this.orderItems.id
          ? new OrderItems(this.client, paymentOrder.orderItems.id)
          : this.orderItems,
      paid:
        paymentOrder.paid.id !== this.paid.id
          ? new Paid(this.client, paymentOrder.paid.id)
          : this.paid,
      payeeInfo:
        paymentOrder.payeeInfo.id !== this.payeeInfo.id
          ? new PayeeInfo(this.client, paymentOrder.payeeInfo.id)
          : this.payeeInfo,
      payer:
        paymentOrder.payer.id !== this.payer.id
          ? new Payer(this.client, paymentOrder.payer.id)
          : this.payer,
      urls:
        paymentOrder.urls.id !== this.urls.id
          ? new Urls(this.client, paymentOrder.urls.id)
          : this.urls,
      lastFetched: new Date(),
      operations: operations.reduce((acc, cur) => {
        acc[cur.rel] = cur;
        return acc;
      }, {} as { [key in responseData.PaymentOrderOperationEntity['rel']]: responseData.PaymentOrderOperationEntity }),
    });
  }

  /**
   * Fetch fresh data from SwedbankPay
   * @param force Force a new request, supersceeding any in-flight requests.
   * @returns A reference to the instance for chaining.
   */
  refresh(force?: boolean) {
    if (force || this._inFlight == null) {
      const promise = this.client.axios
        .get<responseData.PaymentOrderResponse>(this.id)
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
