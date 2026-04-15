export type AuthInfoType = {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: string | null;
};

export type UserInfoType = {
  id: number;
  name: string;
  lastName: string;
}|null;

export type RequestAuthType = {
  name?: string;
  lastName?: string;
  email: string;
  password: string;
  passwordRepeat?: string;
  rememberMe?: boolean;
};

export type ResponseAuthType = {
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user?: {
    email?: string;
    name: string;
    lastName: string;
    id: number;
  };
};
