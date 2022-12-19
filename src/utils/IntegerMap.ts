export const integerMap = {
  number: Number,
  bigint: (typeof BigInt != undefined
    ? BigInt
    : undefined) as BigIntConstructor,
};
