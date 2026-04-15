import type { ResponseCategoryType } from "../types/categoty.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class IncomeCreate {
  constructor() {
    const cancelElement = document.getElementById("cancel");
    if (cancelElement) {
      cancelElement.addEventListener("click", () => {
        window.location.href = "#/income";
      });
    }
    const createElement = document.getElementById("create");
    if (createElement) {
      createElement.addEventListener(
        "click",
        this.createCategotyIncome.bind(this),
      );
    }
  }

  private async createCategotyIncome():Promise<void> {
    const newCategoty:HTMLElement|null = document.getElementById("income");

    if (ValidationUtils.validateForm([{ element: (newCategoty as HTMLInputElement) }])) {
      const response:ResultRequestType = await HttpUtils.request(
        "/categories/income",
       MethodType.POST,
        true,
        { title: (newCategoty as HTMLInputElement).value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if ((response.response as ResponseCategoryType).id && (response.response as ResponseCategoryType).title) {
        window.location.href = "#/income";
      }
    }
  }
}
