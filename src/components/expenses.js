import { DOMElementUtils } from "../utils/DOMElement-utils.js";
import { HttpUtils } from "../utils/http-utils.js";
export class Expenses {
  constructor() {

    this.hiddenElement = document.getElementById("delete-modal-input");
    document
      .getElementById("delete")
      .addEventListener("click", this.deleteCategoty.bind(this));
    this.init();
  }

  async init() {
    const response = await HttpUtils.request("/categories/expense");
    if (response.error) {
      alert("Ошибка запроса категорий расхода!");
    } else if (response.response && Array.isArray(response.response)) {
      this.createCardExpense(response.response);
    }

    document.querySelectorAll(".btn-delete").forEach(function (element) {
      element.addEventListener("click", function () {
        let id = this.getAttribute("data-id");
        document.getElementById("delete-modal-input").value = id;
      });
    });
  }

  createCardExpense(arrayObjExpense) {
    const container = document.getElementById("container-cards");
    arrayObjExpense.forEach((element) => {
      DOMElementUtils.createCardCategoty(element.id, element.title, container,"expenses");
    });
    DOMElementUtils.createEmptyCard(container,"expenses");
  }

  async deleteCategoty() {
    const response = await HttpUtils.request(
      "/categories/expense/" + this.hiddenElement.value,
      "DELETE",
    );
    if (response.error) {
      alert("Ошибка удаления категории");
    } else {
      $("#exampleModal").modal("hide");
      window.location.href = "#/expenses";
    }
  }
}
