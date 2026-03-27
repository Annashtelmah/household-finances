import { BalanceService } from "../services/balance-servis.js";
import { CommonUtils } from "../utils/common-utils.js";
import { HttpUtils } from "../utils/http-utils.js";
import { UrlUtils } from "../utils/url-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class OperationsCreate {
  constructor() {
    this.arrayCategoryIncomme = [];
    this.arrayCategoryExpenses = [];

    const typeOperation = UrlUtils.getUrlParam("typeoperation");
    this.inputTypeElement = document.getElementById("inputType");
    this.inputCategoryElement = document.getElementById("inputCategory");
    this.inputAmountElement = document.getElementById("summa");
    this.inputDateElement = document.getElementById("dateInput");
    this.inputCommentElement = document.getElementById("comment");

    for (let i = 0; i < this.inputTypeElement.options.length; i++) {
      if (this.inputTypeElement.options[i].value === typeOperation) {
        this.inputTypeElement.selectedIndex = i;
        this.selectedValue = this.inputTypeElement.options[i].value;
      }
    }

    $("#dateInput").datepicker({
      format: "dd.mm.yyyy",
      language: "ru",
    });

    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/operations";
    });

    this.buildCategory();
    this.inputTypeElement.addEventListener(
      "change",
      this.buildCategory.bind(this),
    );

    document
      .getElementById("create")
      .addEventListener("click", this.saveOperarion.bind(this));
  }

  async saveOperarion() {
    if (
      ValidationUtils.validateForm([
        {
          element: this.inputAmountElement,
          options: {
            pattern: /^-?\d+(?:\.\d+)?$/,
          },
        },
        { element: this.inputDateElement },
      ])
    ) {
      const body = {
        type: this.inputTypeElement.value,
        amount: this.inputAmountElement.value,
        date: CommonUtils.convertDate2(this.inputDateElement.value),
        comment: this.inputCommentElement.value
          ? this.inputCommentElement.value
          : " ",
        category_id: +this.inputCategoryElement.value,
      };
      console.log(body);

      const response = await HttpUtils.request(
        "/operations",
        "POST",
        true,
        body,
      );
      if (response.error) {
        console.log(response.response.error);
        alert("Ошибка сохранения операции");
      } else {
        document.getElementById("balans").innerText =
          (await BalanceService.getBalance()) + "$";
        window.location.href = "#/operations";
      }
    }
  }

  async buildCategory() {
    this.selectedValue = this.inputTypeElement.value;
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
    CommonUtils.changeActivMemu(this.selectedValue);
    
  }
}
