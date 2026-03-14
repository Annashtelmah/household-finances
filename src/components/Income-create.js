import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class IncomeCreate {
  constructor() {
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/income";
    });
    document
      .getElementById("create")
      .addEventListener("click", this.createCategotyIncome.bind(this));
  }

  async createCategotyIncome() {
    const newCategoty = document.getElementById("income");

    if (ValidationUtils.validateForm([{ element: newCategoty }])) {
      const response = await HttpUtils.request(
        "/categories/income",
        "POST",
        true,
        { title: newCategoty.value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if (response.response.id && response.response.title) {
        window.location.href = "#/income";
      }

    }
  }
}
