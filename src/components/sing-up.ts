import { AuthService } from "../services/auth-service";
import type {
  ValidationOptionsType,
  ValidationType,
} from "../types/validation.type";
import { AuthUtils } from "../utils/auth-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class SingUp {
  private validation: Array<ValidationType> = [];
  private nameElement: HTMLInputElement | null = null;
  private lastNameElement: HTMLInputElement | null = null;
  private emailElement: HTMLInputElement | null = null;
  private passwordElement: HTMLInputElement | null = null;
  private passwordRepeatElement: HTMLInputElement | null = null;
  private commonErrorElement: HTMLElement | null = null;

  constructor() {
    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      window.location.href = "#/";
      return;
    }
    this.findElements();
    if (
      this.nameElement &&
      this.lastNameElement &&
      this.emailElement &&
      this.passwordElement &&
      this.passwordRepeatElement
    ) {
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
    }
    const signUpButtonElement: HTMLElement | null =
      document.getElementById("singUpButton");
    if (signUpButtonElement) {
      signUpButtonElement.addEventListener("click", this.signUp.bind(this));
    }
  }

  private findElements(): void {
    this.nameElement = document.getElementById("name") as HTMLInputElement;
    this.lastNameElement = document.getElementById(
      "lastName",
    ) as HTMLInputElement;
    this.emailElement = document.getElementById("email") as HTMLInputElement;
    this.passwordElement = document.getElementById(
      "password",
    ) as HTMLInputElement;
    this.passwordRepeatElement = document.getElementById(
      "password-confirm",
    ) as HTMLInputElement;
    this.commonErrorElement = document.getElementById("common-error");
  }

  private async signUp(): Promise<void> {
    if (this.commonErrorElement) {
      this.commonErrorElement.style.display = "none";
    }
    for (let i = 0; i < this.validation.length; i++) {
      if (
        (this.validation[i] as ValidationType).element ===
        this.passwordRepeatElement
      ) {
        if ((this.validation[i] as ValidationType).options) {
          (
            (this.validation[i] as ValidationType)
              .options as ValidationOptionsType
          ).compareTo = (this.passwordElement as HTMLInputElement).value;
        }
      }
    }
    if (ValidationUtils.validateForm(this.validation)) {
      const signUpResult = await AuthService.signUp({
        name: (this.nameElement as HTMLInputElement).value,
        lastName: (this.lastNameElement as HTMLInputElement).value,
        email: (this.emailElement as HTMLInputElement).value,
        password: (this.passwordElement as HTMLInputElement).value,
        passwordRepeat: (this.passwordRepeatElement as HTMLInputElement).value,
      });

      if (signUpResult) {
        window.location.href = "#/login";
        return;
      }
      if (this.commonErrorElement) {
        this.commonErrorElement.style.display = "block";
      }
    }
  }
}
