//import { AuthService } from "../../services/auth-service.js";
//import { AuthUtils } from "../../utils/auth-utils.js";

import { ValidationUtils } from "../utils/validation-utils.js";


export class Login {
  constructor() {
    // if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
    //   return this.openNewRoute("/");
    // }
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
    
    // if (ValidationUtils.validateForm(this.validation)) {
    //   const loginResult = await  AuthService.logIn({
    //     email: this.emailElement.value,
    //     password: this.passwordElement.value,
    //     rememberMe: this.rememberMeElement.checked,
    //   });

    //   if (loginResult) {
    //     AuthUtils.setAuthInfo(
    //       loginResult.accessToken,
    //       loginResult.refreshToken,
    //       {
    //         id: loginResult.id,
    //         name: loginResult.name,
    //       },
    //     );

    //     return this.openNewRoute("/");
    //   }
    //   this.commonErrorElement.style.display = "block";
    // }

      if (ValidationUtils.validateForm(this.validation)) {
        window.location.href="#/"
      }else{
         this.commonErrorElement.style.display = "block";
      }
  }
}