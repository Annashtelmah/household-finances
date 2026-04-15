import type { ResponseCategoryType } from "../types/categoty.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { DOMElementUtils } from "../utils/DOMElement-utils";
import { HttpUtils } from "../utils/http-utils";

export class Income {
  private hiddenElement: HTMLElement | null = null;

  constructor() {
    this.hiddenElement = document.getElementById("delete-modal-input");
    const deleteElement: HTMLElement | null = document.getElementById("delete");
    if (deleteElement) {
      deleteElement.addEventListener("click", this.deleteCategoty.bind(this));
    }
    this.init();
  }

  private async init(): Promise<void> {
    const response: ResultRequestType =
      await HttpUtils.request("/categories/income");
    if (response.error) {
      alert("Ошибка запроса категорий дохода!");
    } else if (response.response && Array.isArray(response.response)) {
      this.createCardIncome(response.response as Array<ResponseCategoryType>);
    }
    const btnDeleteElement: NodeListOf<HTMLAnchorElement> =
      document.querySelectorAll(".btn-delete");
    btnDeleteElement.forEach(function (element: HTMLAnchorElement) {
      element.addEventListener("click", function () {
        let id: string | null = this.getAttribute("data-id");
        const deleteModalinputElement =
          document.getElementById("delete-modal-input");
        if (deleteModalinputElement) {
          (deleteModalinputElement as HTMLInputElement).value = id as string;
        }
      });
    });
  }

  private createCardIncome(arrayObjIncome: Array<ResponseCategoryType>): void {
    const container: HTMLElement | null =
      document.getElementById("container-cards");
    arrayObjIncome.forEach((element) => {
      DOMElementUtils.createCardCategoty(
        element.id.toString(),
        element.title,
        container as HTMLElement,
        "income",
      );
    });
    DOMElementUtils.createEmptyCard(container as HTMLElement, "income");
  }

  private async deleteCategoty(): Promise<void> {
    const response: ResultRequestType = await HttpUtils.request(
      "/categories/income/" + (this.hiddenElement as HTMLOptionElement).value,
      MethodType.DELETE,
    );
    if (response.error) {
      alert("Ошибка удаления категории");
    } else {
      (<any>$("#exampleModal")).modal("hide");
      window.location.href = "#/income";
    }
  }
}
