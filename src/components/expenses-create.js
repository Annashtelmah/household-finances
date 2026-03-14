import { HttpUtils } from "../utils/http-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class Expensescreate {
  constructor() {
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/expenses";
    });
    document
      .getElementById("create")
      .addEventListener("click", this.createCategotyExpenses.bind(this));
  }
  async createCategotyExpenses() {
    const newCategoty = document.getElementById("expense");

    if (ValidationUtils.validateForm([{ element: newCategoty }])) {
      const response = await HttpUtils.request(
        "/categories/expense",
        "POST",
        true,
        { title: newCategoty.value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if (response.response.id && response.response.title) {
        window.location.href = "#/expenses";
      }
    }
  }
}
