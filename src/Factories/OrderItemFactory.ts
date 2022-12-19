import type { IntTypeMap, OrderItemType } from '../Types';
import SwedbankPayClient from '../SwedbankPayClient';

export type OrderItemFactoryOptions = {
  /** The name of the order item. */
  readonly name?: string;
  /** The type of the order item. `PAYMENT_FEE` is the amount you are charged with when you are paying with invoice. The amount can be defined in the `amount` field. */
  readonly type?: OrderItemType;
  /** The 4 decimal precision quantity of order items being purchased. */
  readonly quantity?: number;
  readonly quantityUnit?: string;
  /** The percent value of the VAT multiplied by 100, so `25%` becomes `2500`. */
  readonly vatPercent?: number | bigint;
  /** The classification of the order item. Can be used for assigning the order item to a specific product category, such as `MobilePhone`. Note that `class` cannot contain spaces and must follow the regex pattern `[\w-]*`. Swedbank Pay may use this field for statistics. */
  readonly class?: string;
  /** The price per unit of order item (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK */
  readonly unitPrice?: number | bigint;
  readonly reference?: string;
  readonly displayQuantityUnit?: string;
};

// According to the docs: The percent value of the VAT multiplied by 100, so `25%` becomes `2500`.
const VAT_RATE_SCALE = 100n;

// The 4 decimal precision quantity of order items being purchased.
export const QUANTITY_PRECISION = 10000n;

export default class OrderItemFactory<IntTypeName extends keyof IntTypeMap> {
  private _vatPercent: IntTypeMap[IntTypeName] | undefined;
  private _unitPrice: IntTypeMap[IntTypeName] | undefined;

  private _quantity: number;

  private _class: string | undefined;
  private _name: string | undefined;
  private _quantityUnit: string | undefined;
  private _reference: string | undefined;
  private _displayQuantityUnit: string | undefined;

  private _type: OrderItemType | undefined;

  readonly client: SwedbankPayClient<IntTypeName>;

  constructor(
    client: SwedbankPayClient<IntTypeName>,
    options?: OrderItemFactoryOptions,
  );
  constructor(
    client: SwedbankPayClient<IntTypeName>,
    {
      name,
      type,
      class: className,
      unitPrice,
      vatPercent,
      quantity = 1,
      quantityUnit,
      displayQuantityUnit,
      reference,
    }: OrderItemFactoryOptions = {},
  ) {
    this.client = client;
    const bigIntUnitPrice = ;
    this._vatPercent = vatPercent != null ? client.asNumType(vatPercent) : undefined;
    this._unitPrice = unitPrice != null ? client.asNumType(unitPrice) : undefined;
    this._name = name;
    this._class = className;
    this._type = type;
    this._quantity = quantity;
    this._quantityUnit = quantityUnit;
    this._displayQuantityUnit = displayQuantityUnit;
    this._reference = reference;
  }

  /** The price per unit of order item (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK */
  get unitPrice(): IntTypeMap[IntTypeName] | undefined {
    return this._unitPrice;
  }

  /** The price per unit of order item (including VAT, if any) entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK */
  setUnitPrice(
    newUnitPrice: IntTypeMap[IntTypeName],
    vatPercent?: IntTypeMap[IntTypeName],
  ): void {
    if (vatPercent != null) this._vatPercent = vatPercent;
    this._unitPrice = newUnitPrice;;
  }

  /**
   * The payment’s VAT (Value Added Tax) `amount`, entered in the lowest monetary unit of the selected currency. E.g.: `10000` = `100.00` SEK, `5000` = `50.00` SEK.
   * The `vatAmount` entered will not affect the `amount` shown on the payment page, which only shows the total `amount`.
   * This field is used to specify how much of the total `amount` the VAT will be. Set to 0 (zero) if there is no VAT `amount` charged.
   */
  get vatAmount() {
    const { vatPercent, amount } = this;
    if (vatPercent == null || amount == null) return undefined;
    return (
      amount -
      (amount * (VAT_RATE_SCALE * 100n)) / (VAT_RATE_SCALE * 100n + vatPercent)
    );
  }

  /** The percent value of the VAT multiplied by 100, so `25%` becomes `2500`. */
  get vatPercent(): IntTypeMap[IntTypeName] | undefined {
    return this._vatPercent;
  }

  /** The percent value of the VAT multiplied by 100, so `25%` becomes `2500`. */
  setVatPercent(newVatPercent: IntTypeMap[IntTypeName]): this {
    this._vatPercent = newVatPercent;
    return this;
  }

  /** The classification of the order item. Can be used for assigning the order item to a specific product category, such as `MobilePhone`. Note that `class` cannot contain spaces and must follow the regex pattern `[\w-]*`. Swedbank Pay may use this field for statistics. */
  get class(): string | undefined {
    return this._class;
  }

  /** The classification of the order item. Can be used for assigning the order item to a specific product category, such as `MobilePhone`. Note that `class` cannot contain spaces and must follow the regex pattern `[\w-]*`. Swedbank Pay may use this field for statistics. */
  setClass(newClass: string): this {
    this._class = newClass;
    return this;
  }

  /** The name of the order item. */
  get name(): string | undefined {
    return this._name;
  }

  /** The name of the order item. */
  setName(newName: string): this {
    this._name = newName;
    return this;
  }

  /** The type of the order item. `PAYMENT_FEE` is the amount you are charged with when you are paying with invoice. The amount can be defined in the `amount` field. */
  get type(): OrderItemType | undefined {
    return this._type;
  }

  /** The type of the order item. `PAYMENT_FEE` is the amount you are charged with when you are paying with invoice. The amount can be defined in the `amount` field. */
  setType(newType: OrderItemType): this {
    this._type = newType;
    return this;
  }

  /** The 4 decimal precision quantity of order items being purchased. */
  get quantity(): number {
    return this._quantity;
  }

  /** The 4 decimal precision quantity of order items being purchased. */
  setQuantity(newQuantity: number): this {
    this._quantity = newQuantity;
    return this;
  }

  get quantityUnit(): string | undefined {
    return this._quantityUnit;
  }

  setQuantityUnit(newQuantityUnit: string): this {
    this._quantityUnit = newQuantityUnit;
    return this;
  }

  get reference(): string | undefined {
    return this._reference;
  }

  setReference(newReference: string): this {
    this._reference = newReference;
    return this;
  }

  get displayQuantityUnit(): string | undefined {
    return this._displayQuantityUnit;
  }

  setDisplayQuantityUnit(newDisplayQuantityUnit: string): this {
    this._displayQuantityUnit = newDisplayQuantityUnit;
    return this;
  }

  get amount(): bigint | undefined {
    const { unitPrice } = this;
    if (unitPrice == null) return undefined;
    return (
      (unitPrice *
        BigInt(Math.floor(this.quantity * Number(QUANTITY_PRECISION)))) /
      QUANTITY_PRECISION
    );
  }

  get displayQuantity(): string {
    const bigIntVal = BigInt(Math.floor(this.quantity));
    const fractions = BigInt(
      Math.round((this.quantity % 1) * Number(QUANTITY_PRECISION)),
    );
    if (fractions === 0n) return bigIntVal.toString();
    return `${bigIntVal}.${fractions}`;
  }

  getErrors(): [key: string, msg: string][] {
    const errors: [key: string, msg: string][] = [];
    const {
      reference,
      name,
      type,
      class: className,
      quantity,
      quantityUnit,
      unitPrice,
      vatPercent,
    } = this;
    if (!reference) {
      errors.push(['reference', 'Reference is required']);
    }
    if (!name) {
      errors.push(['name', 'Name is required']);
    }
    if (!type) {
      errors.push(['type', 'Type is required']);
    }
    if (!className) {
      errors.push(['class', 'Class is required']);
    }
    if (quantity == null) {
      errors.push(['quantity', 'Quantity is required']);
    }
    if (quantityUnit == null) {
      errors.push(['quantityUnit', 'Quantity unit is required']);
    }
    if (unitPrice == null) {
      errors.push(['unitPrice', 'Unit price unit is required']);
    }
    if (vatPercent == null) {
      errors.push(['vatPercent', 'Unit price unit is required']);
    }
    return errors;
  }

  toJSON(): OrderItemFactoryOptions & { amount: number } {
    return {
      name: this.name,
      type: this.type,
      quantity: this.quantity,
      quantityUnit: this.quantityUnit,
      amount: Number(this.amount),
      vatPercent: Number(this.vatPercent),
      class: this.class,
      unitPrice: Number(this.unitPrice),
      reference: this.reference,
      displayQuantityUnit: this.displayQuantity,
    };
  }
}
