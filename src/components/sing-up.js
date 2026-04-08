import { AuthService } from "../services/auth-service.js";
import { AuthUtils } from "../utils/auth-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class SingUp {
  constructor() {
    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      window.location.href = "#/";
      return;
    }
    this.findElements();
    this.validation = [
      { element: this.nameElement },
      { element: this.lastNameElement },
      {
        element: this.emailElement,
        options: {
          pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      },
      {
        element: this.passwordElement,
        options: {
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        },
      },
      {
        element: this.passwordRepeatElement,
        options: {
          compareTo: this.passwordElement.value,
        },
      },
    ];
    document
      .getElementById("singUpButton")
      .addEventListener("click", this.signUp.bind(this));
  }

  findElements() {
    this.nameElement = document.getElementById("name");
    this.lastNameElement = document.getElementById("lastName");
    this.emailElement = document.getElementById("email");
    this.passwordElement = document.getElementById("password");
    this.passwordRepeatElement = document.getElementById("password-confirm");
    this.commonErrorElement = document.getElementById("common-error");
  }

  async signUp() {
    this.commonErrorElement.style.display = "none";
    for (let i = 0; i < this.validation.length; i++) {
      if (this.validation[i].element === this.passwordRepeatElement) {
        this.validation[i].options.compareTo = this.passwordElement.value;
      }
    }
    if (ValidationUtils.validateForm(this.validation)) {
      const signUpResult = await AuthService.signUp({
        name: this.nameElement.value,
        lastName: this.lastNameElement.value,
        email: this.emailElement.value,
        password: this.passwordElement.value,
        passwordRepeat: this.passwordRepeatElement.value,
      });


      if (signUpResult) {
        window.location.href = "#/login";
        return;
      }
      this.commonErrorElement.style.display = "block";
    }
  }
}
