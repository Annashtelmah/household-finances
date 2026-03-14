import { HttpUtils } from "../utils/http-utils";
import { UrlUtils } from "../utils/url-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class ExpensesEdit {
  constructor() {
    this.expenseElement = document.getElementById("expense");
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/expenses";
    });
    document
      .getElementById("save")
      .addEventListener("click", this.editCategoty.bind(this));
    this.init();
  }

  init() {
    this.id = UrlUtils.getUrlParam("id");
    this.requestCategity(this.id);
  }

  async requestCategity(id) {
    const response = await HttpUtils.request("/categories/expense/" + id);
    if (response.error) {
      alert("Ошибка перехода в редактирование");
    } else if (response.response.id && response.response.title) {
      this.expenseElement.value = response.response.title;
    }
  }

  async editCategoty() {
    if (ValidationUtils.validateForm([{ element: this.expenseElement }])) {
      const response = await HttpUtils.request(
        "/categories/expense/" + this.id,
        "PUT",
        true,
        { title: this.expenseElement.value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if (response.response.id && response.response.title) {
        window.location.href = "#/expenses";
      }
    }
  }
}
