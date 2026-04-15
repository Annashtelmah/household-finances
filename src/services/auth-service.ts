import type { RequestAuthType, ResponseAuthType } from "../types/auth.type";
import type { DefaultResponseType } from "../types/default-response.type";
import { MethodType } from "../types/params-request.type";
import type {
  ResultRequestType,
  ResultResponseLogInType,
  ResultResponseSignUpType,
} from "../types/result-request.type";
import { HttpUtils } from "../utils/http-utils";

export class AuthService {
  public static async logIn(
    data: RequestAuthType,
  ): Promise<ResponseAuthType | DefaultResponseType | false> {
    const result: ResultRequestType = await HttpUtils.request(
      "/login",
      MethodType.POST,
      false,
      data,
    );
    if (result.error || !result.response) {
      return false;
    } else {
      return result.response as ResponseAuthType;
    }
    // if (result.error || !result.response) {
    //   return false;
    // }
    // if (result.response)
    //   {
    //     if(){

    //     }
    //   }
    //   (!result.response.tokens.accessToken ||
    //     !result.response.tokens.refreshToken ||
    //     !result.response.user.id ||
    //     !result.response.user.name)
    // ) {
    //   return false;
    // }
  }

  public static async signUp(
    data: RequestAuthType,
  ): Promise<ResponseAuthType | DefaultResponseType | false> {
    const result: ResultRequestType = await HttpUtils.request(
      "/signup",
      MethodType.POST,
      false,
      data,
    );
    if (result.error || !result.response) {
      return false;
    } else {
      return result.response as ResponseAuthType;
    }
  }

  public static async logOut(data: { refreshToken: string }): Promise<void> {
    await HttpUtils.request("/logout", MethodType.POST, false, data);
  }
}
