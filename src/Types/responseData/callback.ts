import { PaymentInstrument } from '..';

export interface Callback {
  payment?: {
    id: string;
    number: number;
  };
  paymentOrder?: {
    id: string;
    instrument: PaymentInstrument;
  };
  transaction?: {
    id: string;
    number: number;
  };
}
