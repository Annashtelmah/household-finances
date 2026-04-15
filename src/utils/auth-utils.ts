import type { AuthInfoType, ResponseAuthType, UserInfoType } from "../types/auth.type";
import type { DefaultResponseType } from "../types/default-response.type";

export class AuthUtils {
  public static accessTokenKey = "accessToken";
  public static refreshTokenKey = "refreshToken";
  public static userInfoTokenKey = "userInfo";

  public static setAuthInfo(
    accessToken: string,
    refreshToken: string,
    userInfo:UserInfoType = null,
  ): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (userInfo) {
      localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }
  }

  public static removeAuthInfo(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userInfoTokenKey);
  }

  public static getAuthInfo(
    key: string | null = null,
  ): string | AuthInfoType | null {
    if (
      key &&
      [
        this.accessTokenKey,
        this.refreshTokenKey,
        this.userInfoTokenKey,
      ].includes(key)
    ) {
      return localStorage.getItem(key);
    } else {
      return {
        accessToken: localStorage.getItem(this.accessTokenKey),
        refreshToken: localStorage.getItem(this.refreshTokenKey),
        userInfo: localStorage.getItem(this.userInfoTokenKey),
      };
    }
  }

  public static async updateRefreshToken(): Promise<boolean> {
    let result: boolean = false;
    const refreshToken: string | null | AuthInfoType = this.getAuthInfo(
      this.refreshTokenKey,
    );
    if (refreshToken) {
      const response: Response = await fetch(
        "http://localhost:3000/api/refresh",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        },
      );
      if (response && response.status === 200) {
        const tokens: ResponseAuthType | DefaultResponseType =
          await response.json();

        if (tokens) {
          if ((tokens as DefaultResponseType).error !== undefined) {
            throw new Error((tokens as DefaultResponseType).message);
          }
          if ((tokens as ResponseAuthType).tokens !== undefined) {
            const tk = (tokens as ResponseAuthType).tokens;

            if (tk) {
              this.setAuthInfo(tk.accessToken, tk.refreshToken);
            }
          }
        }

        result = true;
      }
    }
    if (!result) {
      this.removeAuthInfo();
    }
    return result;
  }
}
