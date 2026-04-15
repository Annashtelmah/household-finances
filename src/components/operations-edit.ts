import { BalanceService } from "../services/balance-servis";
import type {
  RequestOperationType,
  ResponseOperationType,
} from "../types/operations.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";
import { UrlUtils } from "../utils/url-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class OperationsEdit {
  private inputTypeElement: HTMLSelectElement | null = null;
  private inputCategoryElement: HTMLSelectElement | null = null;
  private inputAmountElment: HTMLInputElement | null = null;
  private dateInputElement: HTMLInputElement | null = null;
  private inputCommentElement: HTMLInputElement | null = null;
  private selectedValue: string = "";
  private id: string | null = null;
  private oldOperation: RequestOperationType | null = null;

  constructor() {
    this.id = UrlUtils.getUrlParam("id");
    this.inputTypeElement = document.getElementById(
      "inputType",
    ) as HTMLSelectElement;
    this.inputCategoryElement = document.getElementById(
      "inputCategory",
    ) as HTMLSelectElement;
    this.inputAmountElment = document.getElementById(
      "inputAmount",
    ) as HTMLInputElement;
    this.dateInputElement = document.getElementById(
      "dateInput",
    ) as HTMLInputElement;
    this.inputCommentElement = document.getElementById(
      "inputComment",
    ) as HTMLInputElement;
    if (this.id) {
      this.init(this.id);
    }
    (<any>$("#dateInput")).datepicker({
      format: "dd.mm.yyyy",
      language: "ru",
    });
    const cancelElement: HTMLElement | null = document.getElementById("cancel");
    if (cancelElement) {
      cancelElement.addEventListener("click", () => {
        window.location.href = "#/operations";
      });
    }
    const saveElement: HTMLElement | null = document.getElementById("save");
    if (saveElement) {
      saveElement.addEventListener("click", this.saveOperation.bind(this));
    }
  }
  async init(id: string) {
    // получаем с сервера операцию по id
    const response: ResultRequestType = await HttpUtils.request(
      "/operations/" + id,
    );
    if (
      !response.error &&
      response.response &&
      (response.response as ResponseOperationType).id
    ) {
      this.oldOperation = {
        type: (response.response as ResponseOperationType).type,
        amount: +(response.response as ResponseOperationType).amount,
        date: (response.response as ResponseOperationType).date,
        comment: (response.response as ResponseOperationType).comment,
        category_id: 0,
      };
      if (this.inputTypeElement) {
        for (
          let i = 0;
          i < (this.inputTypeElement as HTMLSelectElement).options.length;
          i++
        ) {
          if (
            (
              (this.inputTypeElement as HTMLSelectElement).options[
                i
              ] as HTMLOptionElement
            ).value === (response.response as ResponseOperationType).type
          ) {
            (this.inputTypeElement as HTMLSelectElement).selectedIndex = i;
            this.selectedValue = (
              (this.inputTypeElement as HTMLSelectElement).options[
                i
              ] as HTMLOptionElement
            ).value;
          }
        }
      }
      await this.buildCategory();
      if (this.inputCategoryElement) {
        for (
          let i = 0;
          i < (this.inputCategoryElement as HTMLSelectElement).options.length;
          i++
        ) {
          if (
            (
              (this.inputCategoryElement as HTMLSelectElement).options[
                i
              ] as HTMLOptionElement
            ).innerText ===
            (response.response as ResponseOperationType).category
          ) {
            this.oldOperation.category_id = +(
              (this.inputCategoryElement as HTMLSelectElement).options[
                i
              ] as HTMLOptionElement
            ).value;
            this.inputCategoryElement.selectedIndex = i;
          }
        }
      }
      if (this.inputAmountElment) {
        this.inputAmountElment.value = (
          response.response as ResponseOperationType
        ).amount.toString();
      }
      if (this.inputCommentElement) {
        this.inputCommentElement.value = (
          response.response as ResponseOperationType
        ).comment
          ? (response.response as RequestOperationType).comment
          : " ";
      }
      if (this.dateInputElement) {
        this.dateInputElement.value = new Date(
          (response.response as ResponseOperationType).date,
        ).toLocaleDateString("ru-RU");
      }
      if (this.inputTypeElement) {
        this.inputTypeElement.addEventListener(
          "change",
          this.buildCategory.bind(this),
        );
      }
    } else {
      alert("Ошибка! Опреация для редактирования не найдена!");
    }
  }

  private async buildCategory(): Promise<void> {
    if (this.inputTypeElement) {
      this.selectedValue = this.inputTypeElement.value;
    }
    if (this.inputCategoryElement) {
      CommonUtils.clearOptionForSelect(this.inputCategoryElement);

      if (this.selectedValue === "income") {
        CommonUtils.createOptionForSelect(
          this.inputCategoryElement,
          await CommonUtils.getCaregories("income"),
        );
      } else if (this.selectedValue === "expense") {
        CommonUtils.createOptionForSelect(
          this.inputCategoryElement,
          await CommonUtils.getCaregories("expense"),
        );
      } else {
        alert("Не выбран тип операции!");
      }
    }
    CommonUtils.changeActivMemu(this.selectedValue);
  }

  private async saveOperation(): Promise<void> {
    if (
      this.inputAmountElment &&
      this.dateInputElement &&
      this.inputTypeElement &&
      this.inputCommentElement &&
      this.inputCategoryElement
    ) {
      if (
        ValidationUtils.validateForm([
          {
            element: this.inputAmountElment,
            options: {
              pattern: /^-?\d+(?:\.\d+)?$/,
            },
          },
          { element: this.dateInputElement },
        ])
      ) {
        const newOperation = {
          type: this.inputTypeElement.value,
          amount: +this.inputAmountElment.value,
          date: CommonUtils.convertDate2(this.dateInputElement.value),
          comment: this.inputCommentElement.value,
          category_id: +this.inputCategoryElement.value,
        };

        if (
          !(JSON.stringify(newOperation) === JSON.stringify(this.oldOperation))
        ) {
          const response: ResultRequestType = await HttpUtils.request(
            "/operations/" + this.id,
            MethodType.PUT,
            true,
            newOperation,
          );
          if (response.error) {
            return alert("Ошибка редактирования операции!");
          }
        }
        const balanceElement: HTMLElement | null =
          document.getElementById("balans");
        if (balanceElement) {
          balanceElement.innerText = (await BalanceService.getBalance()) + "$";
        }
        window.location.href = "#/operations";
      }
    }
  }
}
