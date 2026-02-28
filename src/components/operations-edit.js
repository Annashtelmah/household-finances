import { CommonUtils } from "../utils/common-utils.js";
import { UrlUtils } from "../utils/url-utils.js";
import { ValidationUtils } from "../utils/validation-utils.js";

export class OperationsEdit {
  constructor() {
    const idOperation = UrlUtils.getUrlParam("typeoperation");
    this.inputTypeElement = document.getElementById("inputType");
    this.inputCategoryElement = document.getElementById("inputCategory");
    this.init();

    $("#dateInput").datepicker({
      format: "dd.mm.yyyy",
      language: "ru",
    });

    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/operations";
    });

    document.getElementById("save").addEventListener("click", () => {
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

  async init() {
    // получаем с сервера операцию по id
    let response = {
      type: "income",
      amount: 250,
      date: "2022-01-01",
      comment: "",
      category_id: 3,
    };
    //

    //получаем категории
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
    //
    for (let i = 0; i < this.inputTypeElement.options.length; i++) {
      if (this.inputTypeElement.options[i].value === response.type) {
        this.inputTypeElement.selectedIndex = i;
        this.selectedValue = this.inputTypeElement.options[i].value;
      }
    }
    this.buildCategory();
    for (let i = 0; i < this.inputCategoryElement.options.length; i++) {
      console.log(this.inputCategoryElement.options[i].value);
      console.log(response.category_id);
      if (
        Number(this.inputCategoryElement.options[i].value) ===
        response.category_id
      ) {
        this.inputCategoryElement.selectedIndex = i;
      }
    }
    document.getElementById("summa").value = response.amount;
    document.getElementById("comment").value = response.comment
      ? response.comment
      : "";
document.getElementById("dateInput").value= new Date(response.date).toLocaleDateString("ru-RU");
    this.inputTypeElement.addEventListener(
      "change",
      this.buildCategory.bind(this),
    );
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
