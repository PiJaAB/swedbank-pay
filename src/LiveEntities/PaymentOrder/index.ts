import SwedbankPayClient from '../../SwedbankPayClient';
import { PaymentOrderOperation, responseData } from '../../Types';
import {
  FinancialTransactionListEntry,
  OrderItemListEntry,
} from '../../Types/responseData';
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

function paramData(
  data: responseData.PaymentOrderResponse,
  client: SwedbankPayClient,
  existing?: PaymentOrder,
) {
  const { paymentOrder, operations } = data;
  return {
    id: paymentOrder.id,
    operation: paymentOrder.operation,
    status: paymentOrder.status,
    created: new Date(paymentOrder.created),
    updated: new Date(paymentOrder.updated),
    amount: paymentOrder.amount,
    vatAmount: paymentOrder.vatAmount,
    description: paymentOrder.description,
    initiatingSystemUserAgent: paymentOrder.initiatingSystemUserAgent,
    language: paymentOrder.language,
    availableInstruments: [...paymentOrder.availableInstruments],
    implementation: paymentOrder.implementation,
    integration: paymentOrder.integration,
    instrumentMode: paymentOrder.instrumentMode,
    guestMode: paymentOrder.guestMode,
    aborted:
      !existing || paymentOrder.aborted.id !== existing.aborted.id
        ? new Aborted(client, paymentOrder.aborted.id)
        : existing.aborted,
    cancelled:
      !existing || paymentOrder.cancelled.id !== existing.cancelled.id
        ? new Cancelled(client, paymentOrder.cancelled.id)
        : existing.cancelled,
    failed:
      !existing || paymentOrder.failed.id !== existing.failed.id
        ? new Failed(client, paymentOrder.failed.id)
        : existing.failed,
    failedAttempts:
      !existing || paymentOrder.failedAttempts.id !== existing.failedAttempts.id
        ? new FailedAttempts(client, paymentOrder.failedAttempts.id)
        : existing.failedAttempts,
    financialTransactions:
      !existing ||
      paymentOrder.financialTransactions.id !==
        existing.financialTransactions.id
        ? new FinancialTransactions(
            client,
            paymentOrder.financialTransactions.id,
          )
        : existing.financialTransactions,
    history:
      !existing || paymentOrder.history.id !== existing.history.id
        ? new History(client, paymentOrder.history.id)
        : existing.history,
    metadata:
      !existing || paymentOrder.metadata.id !== existing.metadata.id
        ? new Metadata(client, paymentOrder.metadata.id)
        : existing.metadata,
    orderItems:
      !existing || paymentOrder.orderItems?.id !== existing.orderItems?.id
        ? (paymentOrder.orderItems &&
            new OrderItems(client, paymentOrder.orderItems.id)) ??
          null
        : existing.orderItems,
    paid:
      !existing || paymentOrder.paid.id !== existing.paid.id
        ? new Paid(client, paymentOrder.paid.id)
        : existing.paid,
    payeeInfo:
      !existing || paymentOrder.payeeInfo.id !== existing.payeeInfo.id
        ? new PayeeInfo(client, paymentOrder.payeeInfo.id)
        : existing.payeeInfo,
    payer:
      !existing || paymentOrder.payer?.id !== existing.payer?.id
        ? (paymentOrder.payer && new Payer(client, paymentOrder.payer.id)) ??
          null
        : existing.payer,
    urls:
      !existing || paymentOrder.urls.id !== existing.urls.id
        ? new Urls(client, paymentOrder.urls.id)
        : existing.urls,
    remainingReversalAmount: paymentOrder.remainingReversalAmount ?? null,
    remainingCaptureAmount: paymentOrder.remainingCaptureAmount ?? null,
    remainingCancellationAmount:
      paymentOrder.remainingCancellationAmount ?? null,
    operations: operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key in responseData.PaymentOrderOperationEntity['rel']]: responseData.PaymentOrderOperationEntity }),
  };
}

export default class PaymentOrder {
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
  readonly orderItems: OrderItems | null;
  readonly paid: Paid;
  readonly payeeInfo: PayeeInfo;
  readonly payer: Payer | null;
  readonly urls: Urls;

  readonly lastFetched: Date;

  readonly client: SwedbankPayClient;

  constructor(
    client: SwedbankPayClient,
    options: responseData.PaymentOrderResponse,
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

  static async load(client: SwedbankPayClient, id: string) {
    if (!id.startsWith('/')) {
      id = `${ID_PREFIX}${id}`;
    }
    const res = await client.axios.get<responseData.PaymentOrderResponse>(id);
    return new this(client, res.data, new Date());
  }

  async getCapturedAmount(excludeSingleStep = false) {
    const list = await this.financialTransactions.getFinancialTransactionList();
    const types: readonly FinancialTransactionListEntry['type'][] =
      excludeSingleStep ? ['Capture'] : ['Capture', 'Sale'];
    return list.reduce(
      (acc, entry) => (types.includes(entry.type) ? acc + entry.amount : acc),
      0,
    );
  }

  /**
   * Whether this paymentOrder is paid and captured in full.
   */
  async isFullyCaptured(excludeSingleStep = false) {
    return (await this.getCapturedAmount(excludeSingleStep)) === this.amount;
  }

  async getReversedAmount() {
    const list = await this.financialTransactions.getFinancialTransactionList();
    return list.reduce(
      (acc, entry) => (entry.type === 'Reversal' ? acc + entry.amount : acc),
      0,
    );
  }

  /**
   * Whether this paymentOrder is fully reversed
   */
  async isFullyReversed() {
    return (await this.getReversedAmount()) === this.amount;
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
    if (
      this.remainingCaptureAmount == null ||
      this.remainingCaptureAmount === 0
    ) {
      throw new Error('No remaining reversal amount');
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
      if (amount > this.remainingCaptureAmount) {
        throw new Error(
          'OrderItems amount sum exceeds remaining capture amount',
        );
      }
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

  async reversal(
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
    const reversalOperation =
      this.operations.reversal ??
      (await this.refresh().then(
        ({ operations }) => operations.reversal ?? null,
      ));
    if (reversalOperation == null) {
      throw new Error('No reversal operation available');
    }
    if (
      this.remainingReversalAmount == null ||
      this.remainingReversalAmount === 0
    ) {
      throw new Error('No remaining reversal amount');
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
      if (amount > this.remainingReversalAmount) {
        throw new Error(
          'OrderItems amount sum exceeds remaining reversal amount',
        );
      }
      transaction = {
        description,
        amount,
        vatAmount,
        payeeReference,
        receiptReference,
        orderItems,
      };
    } else {
      const amount = this.remainingReversalAmount;
      const vatAmount = Math.round(amount * (this.vatAmount / this.amount));
      transaction = {
        description,
        amount,
        vatAmount,
        payeeReference,
        receiptReference,
      };
    }
    return this.client.axios
      .post(reversalOperation.href, {
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
        .get<responseData.PaymentOrderResponse>(this.id)
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
