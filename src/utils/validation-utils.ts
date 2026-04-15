import type {
  ValidationOptionsType,
  ValidationType,
} from "../types/validation.type";

export class ValidationUtils {
  public static validateForm(validations: Array<ValidationType>): boolean {
    let isValid = true;
    for (let i = 0; i < validations.length; i++) {
      if (
        !ValidationUtils.validateFilds(
          (validations[i] as ValidationType).element,
          (validations[i] as ValidationType).options,
        )
      ) {
        isValid = false;
      }
    }
    return isValid;
  }

  private static validateFilds(
    element: HTMLInputElement,
    options?: ValidationOptionsType,
  ): boolean {
    let condition: string | boolean = element.value.trim();
    if (options) {
      if (options.hasOwnProperty("pattern")) {
        if (element.value && element.value.match(options.pattern)) {
          condition = true;
        }
      } else if (options.hasOwnProperty("compareTo")) {
        condition = element.value && element.value == options.compareTo;
      }
    }
    if (condition) {
      element.classList.remove("is-invalid");
      return true;
    } else {
      element.classList.add("is-invalid");
      return false;
    }
  }
}
