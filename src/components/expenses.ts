import type { ResponseCategoryType } from "../types/categoty.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { DOMElementUtils } from "../utils/DOMElement-utils";
import { HttpUtils } from "../utils/http-utils";

export class Expenses {
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
    const response: ResultRequestType = await HttpUtils.request(
      "/categories/expense",
    );
    if (response.error) {
      alert("Ошибка запроса категорий расхода!");
    } else if (response.response && Array.isArray(response.response)) {
      this.createCardExpense(response.response as Array<ResponseCategoryType>);
    }
    const btnDeleteElement: NodeListOf<HTMLAnchorElement> =
      document.querySelectorAll(".btn-delete");
    btnDeleteElement.forEach(function (element: HTMLAnchorElement) {
      element.addEventListener("click", function () {
        let id:string|null = this.getAttribute("data-id");
        const deleteModalinputElement=document.getElementById("delete-modal-input");
        if (deleteModalinputElement) {
          (deleteModalinputElement as HTMLInputElement).value = id as string;
        }
      });
    });
  }

private createCardExpense(arrayObjExpense:Array<ResponseCategoryType>):void {
    const container:HTMLElement|null = document.getElementById("container-cards");
    arrayObjExpense.forEach((element:ResponseCategoryType) => {
      DOMElementUtils.createCardCategoty(
        element.id.toString(),
        element.title,
        container as HTMLElement,
        "expenses",
      );
    });
    DOMElementUtils.createEmptyCard(container as HTMLElement, "expenses");
  }

private  async deleteCategoty():Promise<void> {
    const response = await HttpUtils.request(
      "/categories/expense/" + (this.hiddenElement as HTMLInputElement).value,
      MethodType.DELETE,
    );
    if (response.error) {
      alert("Ошибка удаления категории");
    } else {
      (<any>$("#exampleModal")).modal("hide");
      window.location.href = "#/expenses";
    }
  }
}
