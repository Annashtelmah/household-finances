import { AuthService } from "../services/auth-service.js";
import { AuthUtils } from "../utils/auth-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class Login {
  constructor() {
    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      window.location.href = "#/";
      return;
    }
    this.findElements();
    this.validation = [
      { element: this.passwordElement },
      {
        element: this.emailElement,
        options: {
          pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      },
    ];
    document
      .getElementById("loginButton")
      .addEventListener("click", this.login.bind(this));
  }

  findElements() {
    this.emailElement = document.getElementById("email");
    this.passwordElement = document.getElementById("password");
    this.rememberMeElement = document.getElementById("remember-me");
    this.commonErrorElement = document.getElementById("common-error");
  }

  async login() {
    this.commonErrorElement.style.display = "none";

    if (ValidationUtils.validateForm(this.validation)) {
      const loginResult = await AuthService.logIn({
        email: this.emailElement.value,
        password: this.passwordElement.value,
        rememberMe: this.rememberMeElement.checked,
      });

      if (loginResult) {
        
        AuthUtils.setAuthInfo(
          loginResult.tokens.accessToken,
          loginResult.tokens.refreshToken,
          {
            id: loginResult.user.id,
            name: loginResult.user.name,
            lastName: loginResult.user.lastName,
          },
        );
        window.location.href = "#/";
      }
      this.commonErrorElement.style.display = "block";
    }

  }
}
