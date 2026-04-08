import { BalanceService } from "../services/balance-servis.js";
import { CommonUtils } from "../utils/common-utils.js";
import { HttpUtils } from "../utils/http-utils.js";
import { UrlUtils } from "../utils/url-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class OperationsEdit {
  constructor() {
    this.id = UrlUtils.getUrlParam("id");
    this.inputTypeElement = document.getElementById("inputType");
    this.inputCategoryElement = document.getElementById("inputCategory");
    this.inputAmountElment = document.getElementById("inputAmount");
    this.dateInputElement = document.getElementById("dateInput");
    this.inputCommentElement = document.getElementById("inputComment");

    this.init(this.id);

    $("#dateInput").datepicker({
      format: "dd.mm.yyyy",
      language: "ru",
    });

    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/operations";
    });

    document
      .getElementById("save")
      .addEventListener("click", this.saveOperation.bind(this));
  }

  async init(id) {
    // получаем с сервера операцию по id
    const response = await HttpUtils.request("/operations/" + id);
    if (!response.error && response.response && response.response.id) {
      this.oldOperation = {
        type: response.response.type,
        amount: +response.response.amount,
        date: response.response.date,
        comment: response.response.comment,
      };
      for (let i = 0; i < this.inputTypeElement.options.length; i++) {
        if (this.inputTypeElement.options[i].value === response.response.type) {
          this.inputTypeElement.selectedIndex = i;
          this.selectedValue = this.inputTypeElement.options[i].value;
        }
      }
      await this.buildCategory();
      for (let i = 0; i < this.inputCategoryElement.options.length; i++) {
        if (
          this.inputCategoryElement.options[i].innerText ===
          response.response.category
        ) {
          this.oldOperation.category_id =
            +this.inputCategoryElement.options[i].value;
          this.inputCategoryElement.selectedIndex = i;
        }
      }
      this.inputAmountElment.value = response.response.amount;
      this.inputCommentElement.value = response.response.comment
        ? response.response.comment
        : " ";
      this.dateInputElement.value = new Date(
        response.response.date,
      ).toLocaleDateString("ru-RU");
      this.inputTypeElement.addEventListener(
        "change",
        this.buildCategory.bind(this),
      );
    } else {
      alert("Ошибка! Опреация для редактирования не найдена!");
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

  async saveOperation() {
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
        const response = await HttpUtils.request(
          "/operations/" + this.id,
          "PUT",
          true,
          newOperation,
        );
        if (response.error) {
          return alert("Ошибка редактирования операции!");
        }
      }
      
      document.getElementById("balans").innerText =
        (await BalanceService.getBalance()) + "$";
      window.location.href = "#/operations";
    }
  }
}
