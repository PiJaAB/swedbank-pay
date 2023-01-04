import Payment from './Payment';
export * from './Payment';
import PaymentOrder from './PaymentOrder';
export * from './PaymentOrder';

export { default as LazyEntity } from './LazyEntity';
export * from './LazyEntity';

export const LiveEntities = {
  Payment,
  PaymentOrder,
} as const;

export default LiveEntities;
