import { HttpUtils } from "../utils/http-utils";
import { UrlUtils } from "../utils/url-utils";
import { ValidationUtils } from "../utils/validation-utils";

export class IncomeEdit {
  constructor() {
    this.incomeElement = document.getElementById("income");
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/income";
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
    const response = await HttpUtils.request("/categories/income/" + id);
    if (response.error) {
      alert("Ошибка перехода в редактирование");
    } else if (response.response.id && response.response.title) {
      this.incomeElement.value = response.response.title;
    }
  }

  async editCategoty() {
    if (ValidationUtils.validateForm([{ element: this.incomeElement }])) {
      const response = await HttpUtils.request(
        "/categories/income/" + this.id,
        "PUT",
        true,
        { title: this.incomeElement.value },
      );
      if (response.error) {
        alert("Ошибка создания категории. Обратитесь в тех.поддержку!");
      } else if (response.response.id && response.response.title) {
        window.location.href = "#/income";
      }
    }
  }
}
