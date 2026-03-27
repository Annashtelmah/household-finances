import { DOMElementUtils } from "../utils/DOMElement-utils.js";
import { HttpUtils } from "../utils/http-utils.js";

export class Income {
  constructor() {
    this.hiddenElement = document.getElementById("delete-modal-input");
    document
      .getElementById("delete")
      .addEventListener("click", this.deleteCategoty.bind(this));
    this.init();
  }

  async init() {
    const response = await HttpUtils.request("/categories/income");
    if (response.error) {
      alert("Ошибка запроса категорий дохода!");
    } else if (response.response && Array.isArray(response.response)) {
      this.createCardIncome(response.response);
    }

    document.querySelectorAll(".btn-delete").forEach(function (element) {
      element.addEventListener("click", function () {
        let id = this.getAttribute("data-id");
     
        document.getElementById("delete-modal-input").value = id;

        //$('#deleteModal').modal('show');
      });
    });
  }

  createCardIncome(arrayObjIncome) {
    const container = document.getElementById("container-cards");
    arrayObjIncome.forEach((element) => {
      DOMElementUtils.createCardCategoty(element.id, element.title, container,"income");
    });
    DOMElementUtils.createEmptyCard(container,"income");
  }

  async deleteCategoty() {
    const response = await HttpUtils.request(
      "/categories/income/" + this.hiddenElement.value,
      "DELETE",
    );
    if (response.error) {
      alert("Ошибка удаления категории");
    } else {
      $("#exampleModal").modal("hide");
      window.location.href = "#/income";
    }
  }
}
