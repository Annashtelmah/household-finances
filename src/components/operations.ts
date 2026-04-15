import { BalanceService } from "../services/balance-servis";
import type { CategoryTranslateType } from "../types/categoty.type";
import type { ResponseOperationType } from "../types/operations.type";
import { MethodType } from "../types/params-request.type";
import type { ResultRequestType } from "../types/result-request.type";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";

export class Operations {
  private hiddenElement: HTMLElement | null = null;
  private dateInputFromElement: HTMLInputElement | null = null;
  private dateInputToElement: HTMLInputElement | null = null;
  private buttons: NodeListOf<HTMLElement> | null = null;

  constructor() {
    ($("#dateInputFrom") as any)
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", (e: any) => {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });
    ($("#dateInputTo") as any)
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", (e: any) => {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });

    this.hiddenElement = document.getElementById("delete-modal-input");
    const deleteElement: HTMLElement | null = document.getElementById("delete");
    if (deleteElement) {
      deleteElement.addEventListener("click", this.deleteOperation.bind(this));
    }

    this.dateInputFromElement = document.getElementById(
      "dateInputFrom",
    ) as HTMLInputElement;
    this.dateInputToElement = document.getElementById(
      "dateInputTo",
    ) as HTMLInputElement;
    this.buttons = document.querySelectorAll(".buttons-filter button");
    const intervalButtonElement = document.getElementById("intervalButton");

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e: any) =>
        this.handlePeriodClick(e.target.textContent, e.target),
      );
    });
    const btnCreateExpencesElement: HTMLElement | null =
      document.getElementById("btn-create-expences");
    if (btnCreateExpencesElement) {
      btnCreateExpencesElement.addEventListener("click", (e) => {
        window.location.href = "#/operations/create?typeoperation=expense";
      });
    }
    const btnCreateIncomeElement: HTMLElement | null =
      document.getElementById("btn-create-income");
    if (btnCreateIncomeElement) {
      btnCreateIncomeElement.addEventListener("click", (e) => {
        window.location.href = "#/operations/create?typeoperation=income";
      });
    }
    this.initTable();
  }

  private async initTable(): Promise<void> {
    const dataFrom: string | undefined = new Date().toISOString().split("T")[0];
    const dataTo: string | undefined = new Date().toISOString().split("T")[0];
    await this.showOperationsWithFilter(dataFrom as string, dataTo as string);
  }

  private clearStuleButtons(): void {
    (this.buttons as NodeListOf<HTMLElement>).forEach((button) => {
      button.classList.remove("btn-secondary");
      button.classList.add("btn-outline-secondary");
    });
  }

  private handlePeriodClick(periodText: string, obj: HTMLElement): void {
    let startDate: string | null, endDate: string | null;
    this.clearStuleButtons();
    obj.classList.remove("btn-outline-secondary");
    obj.classList.add("btn-secondary");
    switch (periodText.trim().toLowerCase()) {
      case "сегодня":
        startDate = new Date().toLocaleString();
        endDate = new Date().toLocaleString();
        break;
      case "неделя":
        startDate = new Date(
          new Date().setDate(new Date().getDate() - 7),
        ).toLocaleString();
        endDate = new Date().toLocaleString();
        break;
      case "месяц":
        startDate = new Date(
          new Date().setMonth(new Date().getMonth() - 1),
        ).toLocaleString();
        endDate = new Date().toLocaleString();
        break;
      case "год":
        startDate = new Date(
          new Date().setFullYear(new Date().getFullYear() - 1),
        ).toLocaleString();
        endDate = new Date().toLocaleString();
        break;
      case "все":
        startDate = new Date("1970-01-01").toLocaleString();
        endDate = new Date().toLocaleString();
        break;
      case "интервал":
        startDate = (this.dateInputFromElement as HTMLInputElement).value
          ? (this.dateInputFromElement as HTMLInputElement).value
          : null;
        endDate = (this.dateInputToElement as HTMLInputElement).value
          ? (this.dateInputToElement as HTMLInputElement).value
          : null;
        break;
      default:
        return;
    }

    if ( startDate && endDate && CommonUtils.convertDate2(startDate) && CommonUtils.convertDate2(endDate)
    ) {
      this.showOperationsWithFilter(
        CommonUtils.convertDate2(startDate as string) as string,
        CommonUtils.convertDate2(endDate as string) as string,
      );
    } else {
      alert("Установите дату С и дату ПО!");
    }
  }

  private async showOperationsWithFilter(
    dataFrom: string,
    dataTo: string,
  ): Promise<void> {
    const tableContainerElement: HTMLElement | null =
      document.getElementById("table-container");
    if (tableContainerElement) {
      this.clearOrerations(tableContainerElement);
    }
    const response: ResultRequestType = await HttpUtils.request(
      "/operations?period=interval&dateFrom=" + dataFrom + "&dateTo=" + dataTo,
    );

    let i = 0;
    (response.response as Array<ResponseOperationType>).forEach(
      (operation: ResponseOperationType) => {
        i++;
        const tableRow: HTMLTableRowElement = document.createElement("tr");
        const tds = [
          { content: i },
          {
            content: CommonUtils.getTypeTranslete(operation.type)
              ? (
                  CommonUtils.getTypeTranslete(
                    operation.type,
                  ) as CategoryTranslateType
                ).type
              : "",
            classes: CommonUtils.getTypeTranslete(operation.type)
              ? (
                  CommonUtils.getTypeTranslete(
                    operation.type,
                  ) as CategoryTranslateType
                ).class
              : "",
          },
          { content: operation.category },
          { content: operation.amount + " $" },
          { content: CommonUtils.convertDate(operation.date) },
          { content: operation.comment },
        ];
        tds.forEach((td) => {
          const cell:HTMLTableCellElement = document.createElement("td");
          if (td.classes) {
            cell.classList.add(td.classes);
          }
          cell.textContent = td.content.toString();
          tableRow.appendChild(cell);
        });

        const eventCell: HTMLTableCellElement = document.createElement("td");
        eventCell.className = "table-col-event pe-0";
        const deleteLink: HTMLAnchorElement = document.createElement("a");
        deleteLink.href = "javascript:void(0)";
        deleteLink.dataset.bsToggle = "modal";
        deleteLink.dataset.bsTarget = "#exampleModal";
        deleteLink.classList.add("table-btn-ico", "btn-delete");
        deleteLink.setAttribute("data-id", operation.id.toString());
        deleteLink.addEventListener("click", function () {
          let id: string | null = this.getAttribute("data-id");
          const deleteModalInput: HTMLInputElement | null =
            document.getElementById("delete-modal-input") as HTMLInputElement;
          if (id) {
            deleteModalInput.value = id;
          }
        });

        const trashIcon: HTMLElement = document.createElement("i");
        trashIcon.className = "bi bi-trash me-2";
        deleteLink.appendChild(trashIcon);
        eventCell.appendChild(deleteLink);
        const editLink: HTMLAnchorElement = document.createElement("a");
        editLink.href = "/#/operations/edit?id=" + operation.id;
        editLink.className = "table-btn-ico";

        const pencilIcon: HTMLElement = document.createElement("i");
        pencilIcon.className = "bi bi-pencil";
        editLink.appendChild(pencilIcon);
        eventCell.appendChild(editLink);

        tableRow.appendChild(eventCell);
        if (tableContainerElement) {
          tableContainerElement.appendChild(tableRow);
        }
      },
    );
  }

  private clearOrerations(element: HTMLElement): void {
    element.innerHTML = "";
  }

  private async deleteOperation(): Promise<void> {
    const response: ResultRequestType = await HttpUtils.request(
      "/operations/" + (this.hiddenElement as HTMLInputElement).value,
      MethodType.DELETE,
    );
    if (response.error) {
      alert("Ошибка удаления операции");
    } else {
      (document.getElementById("balans") as HTMLElement).innerText =
        (await BalanceService.getBalance()) + "$";
      (<any>$("#exampleModal")).modal("hide");
      window.location.href = "#/operations";
    }
  }
}
