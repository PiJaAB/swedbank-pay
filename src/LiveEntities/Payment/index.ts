import SwedbankPayClient, { NumberType } from '../../SwedbankPayClient';
import {
  IntTypeMap,
  PaymentOrderOperation,
  PaymentResponse,
  PaymentState,
} from '../../Types';
import { ResponseEntity } from '../../Types/responseData';
import PaymentSubEntity from './PaymentSubEntity';

type SubEntityKey = {
  [Key in keyof Payment<SwedbankPayClient<never>>]-?: Payment<
    SwedbankPayClient<never>
  >[Key] extends PaymentSubEntity<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null
    ? Key
    : never;
}[keyof Payment<SwedbankPayClient<never>>] &
  keyof ResponseEntity.PaymentEntity;

type SimpleAccessKey = {
  [Key in SubEntityKey]: Payment<
    SwedbankPayClient<never>
  >[Key] extends PaymentSubEntity<
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
  data: PaymentResponse['payment'],
  key: Key,
  existingOrder?: Payment<Client>,
): Payment<Client>[Key];
function getInstance<
  Key extends SubEntityKey,
  Client extends SwedbankPayClient<keyof IntTypeMap>,
>(
  client: Client,
  data: PaymentResponse['payment'],
  key: Key,
  dataAccessKey: Payment<Client>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | PaymentSubEntity<infer AccessKey, any>
    | undefined
    | null
    ? AccessKey
    : never,
  existingOrder?: Payment<Client>,
): Payment<Client>[Key];
function getInstance<Key extends SubEntityKey>(
  client: SwedbankPayClient<never>,
  data: PaymentResponse['payment'],
  key: Key,
  dataAccessKeyOrExisting:
    | (Payment<SwedbankPayClient<never>>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | PaymentSubEntity<infer AccessKey, any>
        | undefined
        | null
        ? AccessKey
        : never)
    | Payment<SwedbankPayClient<never>>
    | undefined,
  existingOrder?: Payment<SwedbankPayClient<never>>,
): Payment<SwedbankPayClient<never>>[Key] {
  let dataAccessKey: Payment<SwedbankPayClient<never>>[Key] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  if (id == null) return null as Payment<SwedbankPayClient<never>>[Key];
  if (id === existingValue?.id) return existingValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PaymentSubEntity<any, any>(client, dataAccessKey, id) as Payment<
    SwedbankPayClient<never>
  >[Key];
}

function paramData<Client extends SwedbankPayClient<keyof IntTypeMap>>(
  data: PaymentResponse,
  client: Client,
  existing?: Payment<Client>,
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

export default class Payment<
  Client extends SwedbankPayClient<keyof IntTypeMap>,
> {
  readonly id: string;
  readonly number: number;
  readonly created: Date;
  readonly updated: Date;
  readonly instrument: string;
  readonly state: PaymentState;
  readonly operation: PaymentOrderOperation | null;
  readonly currency: string;
  readonly amount: NumberType<Client>;
  readonly vatAmount: NumberType<Client> | null;
  readonly remainingReversalAmount: NumberType<Client> | null;
  readonly remainingCaptureAmount: NumberType<Client> | null;
  readonly remainingCancellationAmount: NumberType<Client> | null;
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

  readonly client: Client;

  constructor(client: Client, options: PaymentResponse, fetched: Date) {
    const data = paramData(options, client);
    this.id = data.id;
    this.number = data.number;
    this.created = data.created;
    this.updated = data.updated;
    this.instrument = data.instrument;
    this.state = data.state;
    this.operation = data.operation;
    this.currency = data.currency;
    this.amount = client.asIntType(data.amount);
    this.vatAmount = client.asIntType(data.vatAmount);
    this.remainingReversalAmount = client.asIntType(
      data.remainingReversalAmount,
    );
    this.remainingCaptureAmount = client.asIntType(data.remainingCaptureAmount);
    this.remainingCancellationAmount = client.asIntType(
      data.remainingCancellationAmount,
    );
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

  static async load<Client extends SwedbankPayClient<never>>(
    client: Client,
    id: string,
  ) {
    if (!id.startsWith('/')) {
      id = `/${id}`;
    }
    const res = await client.axios.get<PaymentResponse>(id);
    return new this(client, res.data, new Date());
  }

  /**
   * Get the amount that has been captured.
   */
  async getCapturedAmount(): Promise<NumberType<Client>>;
  async getCapturedAmount(detailedObject: true): Promise<{
    amount: NumberType<Client>;
    vatAmount: NumberType<Client>;
  }>;
  async getCapturedAmount(detailedObject?: boolean): Promise<
    | {
        amount: NumberType<Client>;
        vatAmount: NumberType<Client>;
      }
    | NumberType<Client>
  >;
  async getCapturedAmount(detailedObject?: boolean) {
    const transactionList = await this.transactions?.get('transactionList');
    if (detailedObject) {
      if (!transactionList) {
        return {
          amount: this.toNum(0) as NumberType<Client>,
          vatAmount: this.toNum(0) as NumberType<Client>,
        };
      }
      const retVal = transactionList.reduce(
        (
          acc: {
            amount: bigint;
            vatAmount: bigint;
          },
          cur,
        ) => {
          if (cur.type === 'Capture' && cur.state === 'Completed') {
            acc.amount += this.toNum(cur.amount);
            acc.vatAmount += this.toNum(cur.vatAmount);
          }
          return acc;
        },
        {
          amount: this.toNum(0),
          vatAmount: this.toNum(0),
        },
      ) as {
        amount: NumberType<Client>;
        vatAmount: NumberType<Client>;
      };
      return retVal;
    }
    if (!transactionList) {
      return this.toNum(0);
    }
    const capturedAmount = transactionList.reduce(
      (acc: bigint, cur) =>
        cur.type === 'Capture' && cur.state === 'Completed'
          ? acc + this.toNum(cur.amount)
          : acc,
      this.toNum(0),
    ) as NumberType<Client>;

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
    const maxCapture = this.toNum(this.remainingCaptureAmount ?? this.amount);
    const amountToCapture = amount != null ? this.toNum(amount) : maxCapture;

    let vatAmountToCapture = this.toNum(vatAmount);
    if (vatAmountToCapture == null) {
      const { vatAmount: alreadyCapturedVatAmount } =
        (await this.getCapturedAmount(true)) as {
          amount: bigint;
          vatAmount: bigint;
        };
      if (alreadyCapturedVatAmount === this.toNum(0)) {
        vatAmountToCapture = this.toNum(this.vatAmount ?? 0);
      } else {
        vatAmountToCapture =
          this.toNum(this.vatAmount ?? 0) - alreadyCapturedVatAmount;
      }
      if (maxCapture !== amountToCapture) {
        vatAmountToCapture =
          (vatAmountToCapture * amountToCapture) / maxCapture;
      }
    }
    const transaction = {
      description,
      amount:
        typeof amountToCapture === 'number'
          ? Math.round(amountToCapture)
          : Number(amountToCapture),
      vatAmount:
        typeof vatAmountToCapture === 'number'
          ? Math.round(vatAmountToCapture)
          : Number(vatAmountToCapture),
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
}
