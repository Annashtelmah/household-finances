import type { ResponseCategoryType } from "../types/categoty.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class Expensescreate {
  constructor() {
    const cancelElement: HTMLElement | null = document.getElementById("cancel");
    if (cancelElement) {
      cancelElement.addEventListener("click", () => {
        window.location.href = "#/expenses";
      });
    }
    const createElement: HTMLElement | null = document.getElementById("create");
    if (createElement) {
      createElement.addEventListener(
        "click",
        this.createCategotyExpenses.bind(this),
      );
    }
  }

  private async createCategotyExpenses(): Promise<void> {
    const newCategoty: HTMLElement | null = document.getElementById("expense");
    if (newCategoty) {
      if (ValidationUtils.validateForm([{ element: (newCategoty as HTMLInputElement)}])) {
        const response:ResultRequestType = await HttpUtils.request(
          "/categories/expense",
         MethodType.POST,
          true,
          { title: (newCategoty as HTMLInputElement).value },
        );
        if (response.error) {
          alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
        } else if ((response.response as ResponseCategoryType).id && (response.response as ResponseCategoryType).title) {
          window.location.href = "#/expenses";
        }
      }
    }
  }
}
