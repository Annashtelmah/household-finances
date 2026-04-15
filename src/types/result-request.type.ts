import type { ResponseAuthType } from "./auth.type";
import type { BalanceType } from "./balance.type";
import type { ResponseCategoryType } from "./categoty.type";
import type { DefaultResponseType } from "./default-response.type";
import type { ResponseOperationType } from "./operations.type";

export type ResultRequestType = {
  error: boolean;
  response:
    | ResponseAuthType
    | DefaultResponseType
    | ResponseCategoryType
    | Array<ResponseCategoryType>
    | ResponseOperationType
    | Array<ResponseOperationType>
    | BalanceType;
};

export type ResultResponseLogInType = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    name: string;
    lastName: string;
    id: number;
  };
};

export type ResultResponseSignUpType = {
  user: {
    id: number;
    email: string;
    name: string;
    lastName: string;
  };
};
