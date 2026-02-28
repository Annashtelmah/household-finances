import { CommonUtils } from "../utils/common-utils.js";
import { UrlUtils } from "../utils/url-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class OperationsCreate {
  constructor() {
    const typeOperation = UrlUtils.getUrlParam("typeoperation");
    this.inputTypeElement = document.getElementById("inputType");
    this.inputCategoryElement = document.getElementById("inputCategory");

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

    this.arrayCategoryIncomme = [
      { id: 1, title: "зарплата" },
      { id: 2, title: "Инвестиции" },
      { id: 3, title: "Сбережения" },
      { id: 4, title: "Депозиты" },
    ];
    this.arrayCategoryExpenses = [
      { id: 1, title: "Еда" },
      { id: 2, title: "Жилье" },
      { id: 3, title: "Спорт" },
      { id: 4, title: "Одежда" },
      { id: 5, title: "Подарки" },
      { id: 6, title: "Авто" },
      { id: 7, title: "Кафе" },
      { id: 8, title: "Развлечения" },
    ];
    this.buildCategory();
    this.inputTypeElement.addEventListener(
      "change",
      this.buildCategory.bind(this),
    );

    document.getElementById("create").addEventListener("click", () => {
      ValidationUtils.validateForm([
        {
          element: document.getElementById("summa"),
          options: {
            pattern: /^-?\d+(?:\.\d+)?$/,
          },
        },
        { element: document.getElementById("dateInput") },
      ]);
    });
  }

  buildCategory() {
    this.selectedValue = this.inputTypeElement.value;
    CommonUtils.clearOptionForSelect(this.inputCategoryElement);
    if (this.selectedValue === "income") {
      CommonUtils.createOptionForSelect(
        this.inputCategoryElement,
        this.arrayCategoryIncomme,
      );
    } else if (this.selectedValue === "expense") {
      debugger;
      CommonUtils.createOptionForSelect(
        this.inputCategoryElement,
        this.arrayCategoryExpenses,
      );
    } else {
      alert("Не выбран тип операции!");
    }
   CommonUtils.changeActivMemu(this.selectedValue);
  }

}
