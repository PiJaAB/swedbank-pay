import SwedbankPayClient from '../../SwedbankPayClient';
import {
  IntTypeMap,
  PaymentOrderOperation,
  PaymentResponse,
  PaymentState,
} from '../../Types';
import { ResponseEntity } from '../../Types/responseData';
import PaymentSubEntity from './PaymentSubEntity';

type SubEntityKey = {
  [Key in keyof Payment<keyof IntTypeMap>]-?: Payment<
    keyof IntTypeMap
  >[Key] extends PaymentSubEntity<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[keyof Payment<keyof IntTypeMap>];

type SimpleAccessKey = {
  [Key in SubEntityKey]: Payment<
    keyof IntTypeMap
  >[Key] extends PaymentSubEntity<
    Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[SubEntityKey];

function getInstance<Key extends SimpleAccessKey>(
  client: SwedbankPayClient<keyof IntTypeMap>,
  data: PaymentResponse['payment'],
  key: Key,
  existingOrder?: Payment,
): Payment[Key];
function getInstance<Key extends SubEntityKey>(
  client: SwedbankPayClient<keyof IntTypeMap>,
  data: PaymentResponse['payment'],
  key: Key,
  dataAccessKey: Payment[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentSubEntity<infer AccessKey, any>
    | undefined
    | null
    ? AccessKey
    : never,
  existingOrder?: Payment,
): Payment[Key];
function getInstance<Key extends SubEntityKey>(
  client: SwedbankPayClient<keyof IntTypeMap>,
  data: PaymentResponse['payment'],
  key: Key,
  dataAccessKeyOrExisting:
    | (Payment[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | PaymentSubEntity<infer AccessKey, any>
        | undefined
        | null
        ? AccessKey
        : never)
    | Payment
    | undefined,
  existingOrder?: Payment,
): Payment[Key] {
  let dataAccessKey: Payment[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentSubEntity<infer AccessKey, any>
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
  if (id == null) return null as Payment[Key];
  if (id === existingValue?.id) return existingValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PaymentSubEntity<any, any>(
    client,
    dataAccessKey,
    id,
  ) as Payment[Key];
}

function paramData<NumberType extends keyof IntTypeMap>(
  data: PaymentResponse,
  client: SwedbankPayClient<NumberType>,
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
    prices: getInstance(client, payment, 'prices', existing),
    transactions: getInstance(client, payment, 'transactions', existing),
    authorizations: getInstance(client, payment, 'authorizations', existing),
    captures: getInstance(client, payment, 'captures', existing),
    reversals: getInstance(client, payment, 'reversals', existing),
    cancellations: getInstance(client, payment, 'cancellations', existing),
    urls: getInstance(client, payment, 'urls', existing),
    payeeInfo: getInstance(client, payment, 'payeeInfo', existing),
    payers: getInstance(client, payment, 'payers', existing),
    metadata: getInstance(client, payment, 'metadata', existing),
    operations: operations.reduce((acc, cur) => {
      acc[cur.rel] = cur;
      return acc;
    }, {} as { [key: string]: ResponseEntity.OperationEntity | undefined }),
  };
}

export default class Paymen0t<IntType extends keyof IntTypeMap> {
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

  readonly prices: PaymentSubEntity<'prices', PaymentResponse.PriceList> | null;
  readonly transactions: PaymentSubEntity<
    'transactions',
    PaymentResponse.TransactionList
  > | null;
  readonly authorizations: PaymentSubEntity<
    'authorizations',
    PaymentResponse.AuthorizationList
  > | null;
  readonly captures: PaymentSubEntity<
    'captures',
    PaymentResponse.CaptureList
  > | null;
  readonly reversals: PaymentSubEntity<
    'reversals',
    PaymentResponse.ReversalList
  > | null;
  readonly cancellations: PaymentSubEntity<
    'cancellations',
    PaymentResponse.CancellationList
  > | null;
  readonly urls: PaymentSubEntity<'urls', PaymentResponse.URLs> | null;
  readonly payeeInfo: PaymentSubEntity<'payeeInfo', PaymentResponse.PayeeInfo>;
  readonly payers: PaymentSubEntity<'payers', PaymentResponse.Payers> | null;
  readonly metadata: PaymentSubEntity<
    'metadata',
    PaymentResponse.Metadata
  > | null;

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
    this.transactions = data.transactions;
    this.authorizations = data.authorizations;
    this.captures = data.captures;
    this.reversals = data.reversals;
    this.cancellations = data.cancellations;
    this.urls = data.urls;
    this.payeeInfo = data.payeeInfo;
    this.payers = data.payers;
    this.metadata = data.metadata;

    this.operations = data.operations;

    this.lastFetched = fetched;
    this.client = client;
  }

  static async load(client: SwedbankPayClient, id: string) {
    if (!id.startsWith('/')) {
      id = `/${id}`;
    }
    const res = await client.axios.get<PaymentResponse>(id);
    return new this(client, res.data, new Date());
  }

  /**
   * Get the amount that has been captured.
   */
  async getCapturedAmount(): Promise<number>;
  async getCapturedAmount(
    detailedObject: true,
  ): Promise<{ amount: number; vatAmaunt: number }>;
  async getCapturedAmount(
    detailedObject?: boolean,
  ): Promise<{ amount: number; vatAmount: number } | number>;
  async getCapturedAmount(detailedObject?: boolean) {
    const transactionList = await this.transactions?.get('transactionList');
    if (!transactionList) {
      return 0;
    }
    const capturedAmount = transactionList.reduce(
      (acc, cur) =>
        cur.type === 'Capture' && cur.state === 'Completed'
          ? acc + cur.amount
          : acc,
      0,
    );

    return capturedAmount;
  }

  /**
   * Whether this paymentOrder is paid and captured in full.
   */
  async isFullyCaptured() {
    const capturedAmount = await this.getCapturedAmount();
    return capturedAmount >= this.amount;
  }

  /**
   * Get the amount that has been reversed.
   */
  async getReversedAmount() {
    const transactionList = await this.transactions?.get('transactionList');
    if (!transactionList) {
      return 0;
    }
    const reversedAmount = transactionList.reduce(
      (acc, cur) =>
        cur.type === 'Reversal' && cur.state === 'Completed'
          ? acc + cur.amount
          : acc,
      0,
    );

    return reversedAmount;
  }

  /**
   * Whether this paymentOrder is paid and reversed in full.
   */
  async isFullyReversed() {
    const reversedAmount = await this.getReversedAmount();
    return reversedAmount >= this.amount;
  }

  async capture({
    description,
    payeeReference,
    receiptReference,
    amount,
    vatAmount,
  }: {
    description: string;
    payeeReference: string;
    receiptReference?: string;
    amount?: number | bigint;
    vatAmount?: number | bigint;
  }) {
    const captureOperation =
      this.operations.capture ??
      (await this.refresh().then(
        ({ operations }) => operations.capture ?? null,
      ));
    if (captureOperation == null) {
      throw new Error('No capture operation available');
    }
    const maxCapture = this.remainingCaptureAmount ?? this.amount;
    const amountToCapture = amount ?? maxCapture;
    const alreadyCapturedAmount = vatAmount ?? this.amount - maxCapture;
    const vatAmountToCapture =
      vatAmount ??
      (alreadyCapturedAmount === 0
        ? this.vatAmount
        : Math.round(amountToCapture * (this.vatAmount / this.amount)));
    const transaction = {
      description,
      amount,
      vatAmount,
      payeeReference,
      receiptReference,
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
