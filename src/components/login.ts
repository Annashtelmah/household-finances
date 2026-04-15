import { AuthService } from "../services/auth-service";
import type { ResponseAuthType } from "../types/auth.type";
import type { DefaultResponseType } from "../types/default-response.type";
import type { ValidationType } from "../types/validation.type";

import { AuthUtils } from "../utils/auth-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class Login {
  private emailElement: HTMLInputElement | null = null;
  private passwordElement: HTMLInputElement | null = null;
  private rememberMeElement: HTMLInputElement | null = null;
  private commonErrorElement: HTMLElement | null = null;
  private validation: Array<ValidationType> = [];

  constructor() {
    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      window.location.href = "#/";
      return;
    }
    this.findElements();
    if (this.passwordElement && this.emailElement) {
      this.validation = [
        { element: this.passwordElement },
        {
          element: this.emailElement,
          options: {
            pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          },
        },
      ];
    }
    const loginButtonElement: HTMLElement | null =
      document.getElementById("loginButton");
    if (loginButtonElement) {
      loginButtonElement.addEventListener("click", this.login.bind(this));
    }
  }

  private findElements(): void {
    this.emailElement = document.getElementById("email") as HTMLInputElement;
    this.passwordElement = document.getElementById(
      "password",
    ) as HTMLInputElement;
    this.rememberMeElement = document.getElementById(
      "remember-me",
    ) as HTMLInputElement;
    this.commonErrorElement = document.getElementById(
      "common-error",
    ) as HTMLInputElement;
  }

  private async login(): Promise<void> {
    if (this.commonErrorElement) {
      this.commonErrorElement.style.display = "none";
    }
    if (ValidationUtils.validateForm(this.validation)) {
      let loginResult: ResponseAuthType | DefaultResponseType | false = false;
      if (this.emailElement && this.passwordElement && this.rememberMeElement) {
        loginResult = await AuthService.logIn({
          email: this.emailElement.value,
          password: this.passwordElement.value,
          rememberMe: this.rememberMeElement.checked,
        });
      }
      if (loginResult) {
        if (
          (loginResult as ResponseAuthType).tokens &&
          (loginResult as ResponseAuthType).user
        ) {
          const token = (loginResult as ResponseAuthType).tokens;
          const user = (loginResult as ResponseAuthType).user;

          if (token && user) {
            AuthUtils.setAuthInfo(token.accessToken, token.refreshToken, {
              id: user.id,
              name: user.name,
              lastName: user.lastName,
            });
          }
        }
        window.location.href = "#/";
      }
      if (this.commonErrorElement) {
        this.commonErrorElement.style.display = "block";
      }
    }
  }
}
