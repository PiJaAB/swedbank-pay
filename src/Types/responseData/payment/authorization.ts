import { AuthorizationEntity } from '../entities';
import { AsPaymentSubResponse } from './paymentSubResponse';

export type Authorization = AsPaymentSubResponse<{
  readonly authorization: AuthorizationEntity;
}>;

export type AuthorizationList = AsPaymentSubResponse<{
  readonly authorizations: {
    readonly authorizationList: ReadonlyArray<AuthorizationEntity>;
  };
}>;
