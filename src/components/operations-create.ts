import { BalanceService } from "../services/balance-servis";
import type {
  CategoryType,
  ResponseCategoryType,
} from "../types/categoty.type";
import type { RequestOperationType } from "../types/operations.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";
import { UrlUtils } from "../utils/url-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class OperationsCreate {
  private arrayCategoryIncomme: Array<ResponseCategoryType> = [];
  private arrayCategoryExpenses: Array<ResponseCategoryType> = [];
  private inputTypeElement: HTMLSelectElement | null = null;
  private inputCategoryElement: HTMLSelectElement | null = null;
  private inputAmountElement: HTMLInputElement | null = null;
  private inputDateElement: HTMLInputElement | null = null;
  private inputCommentElement: HTMLInputElement | null = null;
  private selectedValue: string = "";

  constructor() {
    const typeOperation: string | null = UrlUtils.getUrlParam("typeoperation");
    this.inputTypeElement = document.getElementById(
      "inputType",
    ) as HTMLSelectElement;
    this.inputCategoryElement = document.getElementById(
      "inputCategory",
    ) as HTMLSelectElement;
    this.inputAmountElement = document.getElementById(
      "summa",
    ) as HTMLInputElement;
    this.inputDateElement = document.getElementById(
      "dateInput",
    ) as HTMLInputElement;
    this.inputCommentElement = document.getElementById(
      "comment",
    ) as HTMLInputElement;

    for (let i = 0; i < this.inputTypeElement.options.length; i++) {
      if (
        (this.inputTypeElement.options[i] as HTMLOptionElement).value ===
        typeOperation
      ) {
        this.inputTypeElement.selectedIndex = i;
        this.selectedValue = (
          this.inputTypeElement.options[i] as HTMLOptionElement
        ).value;
      }
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

    this.buildCategory();
    this.inputTypeElement.addEventListener(
      "change",
      this.buildCategory.bind(this),
    );
    const createElement: HTMLElement | null = document.getElementById("create");
    if (createElement) {
      createElement.addEventListener("click", this.saveOperarion.bind(this));
    }
  }

  private async saveOperarion(): Promise<void> {
    if (
      ValidationUtils.validateForm([
        {
          element: this.inputAmountElement as HTMLInputElement,
          options: {
            pattern: /^-?\d+(?:\.\d+)?$/,
          },
        },
        { element: this.inputDateElement as HTMLInputElement },
      ])
    ) {
      let body: RequestOperationType;
      if (
        this.inputTypeElement &&
        this.inputAmountElement &&
        this.inputDateElement &&
        CommonUtils.convertDate2(
          (this.inputDateElement as HTMLInputElement).value,
        ) &&
        this.inputCommentElement &&
        this.inputCategoryElement
      ) {
        body = {
          type: (this.inputTypeElement as HTMLSelectElement)
            .value as CategoryType,
          amount: +(this.inputAmountElement as HTMLInputElement).value,
          date: CommonUtils.convertDate2(
            (this.inputDateElement as HTMLInputElement).value,
          ) as string,
          comment: this.inputCommentElement.value
            ? this.inputCommentElement.value
            : " ",
          category_id: +this.inputCategoryElement.value,
        };

        const response: ResultRequestType = await HttpUtils.request(
          "/operations",
          MethodType.POST,
          true,
          body,
        );
        if (response.error) {
          alert("Ошибка сохранения операции");
        } else {
          const balanceElement: HTMLElement | null =
            document.getElementById("balans");
          if (balanceElement) {
            balanceElement.innerText =
              (await BalanceService.getBalance()) + "$";
          }
          window.location.href = "#/operations";
        }
      }
    }
  }

  private async buildCategory(): Promise<void> {
    if (this.inputTypeElement) {
      this.selectedValue = this.inputTypeElement.value;
    }
    if (this.inputCategoryElement) {
      CommonUtils.clearOptionForSelect(this.inputCategoryElement);
    }
    if (this.selectedValue === "income" && this.inputCategoryElement) {
      CommonUtils.createOptionForSelect(
        this.inputCategoryElement,
        await CommonUtils.getCaregories("income"),
      );
    } else if (this.selectedValue === "expense"  && this.inputCategoryElement) {
      CommonUtils.createOptionForSelect(
        this.inputCategoryElement,
        await CommonUtils.getCaregories("expense"),
      );
    } else {
      alert("Не выбран тип операции!");
    }
    CommonUtils.changeActivMemu(this.selectedValue);
  }
}
