import { MethodType, type ParamsRequestType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { AuthUtils } from "./auth-utils";

export class HttpUtils {

  public static async request(url:string, method:MethodType= MethodType.GET, useAuth:boolean = true, body:any = null):Promise<ResultRequestType> {
    const result:ResultRequestType = {
      error: false,
      response: [],
    };

    const params:ParamsRequestType = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "*/*",
      },
    };
    let token = null;
    if (useAuth) {
      token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
      if (token) {
        params.headers["x-auth-token"] = token.toString();
      }
    }
    if (body) {
      params.body = JSON.stringify(body);
    }
    let response:Response|null = null;
    try {
      response = await fetch("http://localhost:3000/api" + url, params);
      result.response = await response.json();
    } catch (e) {
      result.error = true;
      return result;
    }
    if (response.status < 200 || response.status >= 300) {
      result.error = true;
      if (useAuth && response.status === 401) {
        if (!token) {
          //1-токена нет
          window.location.href = "#/login";
        } else {
          //2-токен устарел
          const updateTokinResult:boolean = await AuthUtils.updateRefreshToken();
          if (updateTokinResult) {
            return this.request(url, method, useAuth, body);
          } else {
            window.location.href = "#/login";
          }
        }
      }
    }
  
    return result;
  }
}
