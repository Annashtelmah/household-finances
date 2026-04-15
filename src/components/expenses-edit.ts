import type { ResponseCategoryType } from "../types/categoty.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { HttpUtils } from "../utils/http-utils";
import { UrlUtils } from "../utils/url-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class ExpensesEdit {
  private expenseElement: HTMLElement | null = null;
  private cancelElement: HTMLElement | null = null;
  private saveElement: HTMLElement | null = null;
  private id: string | null = null;

  constructor() {
    this.expenseElement = document.getElementById("expense");
    this.cancelElement = document.getElementById("cancel");
    if (this.cancelElement) {
      this.cancelElement.addEventListener("click", () => {
        window.location.href = "#/expenses";
      });
    }

    this.saveElement = document.getElementById("save");
    if (this.saveElement) {
      this.saveElement.addEventListener("click", this.editCategoty.bind(this));
    }

    this.init();
  }

  private init(): void {
    this.id = UrlUtils.getUrlParam("id");
    if (this.id) {
      this.requestCategity(this.id);
    }
  }

  private async requestCategity(id: string): Promise<void> {
    const response: ResultRequestType = await HttpUtils.request(
      "/categories/expense/" + id,
    );
    if (response.error) {
      alert("Ошибка перехода в редактирование");
    } else if ((response.response as ResponseCategoryType).id && (response.response as ResponseCategoryType).title) {
      if (this.expenseElement) {
        (this.expenseElement as HTMLInputElement).value = (response.response as ResponseCategoryType).title;
      }
    }
  }

 private async editCategoty():Promise<void> {
    if (ValidationUtils.validateForm([{ element: (this.expenseElement as HTMLInputElement) }])) {
      const response:ResultRequestType = await HttpUtils.request(
        "/categories/expense/" + this.id,
        MethodType.PUT,
        true,
        { title: (this.expenseElement as HTMLInputElement).value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if ((response.response as ResponseCategoryType).id && (response.response as ResponseCategoryType).title) {
        window.location.href = "#/expenses";
      }
    }
  }
}
