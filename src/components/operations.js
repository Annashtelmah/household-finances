import { BalanceService } from "../services/balance-servis";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";

export class Operations {
  constructor() {
    $("#dateInputFrom")
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", function (e) {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });
    $("#dateInputTo")
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", function (e) {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });

    this.hiddenElement = document.getElementById("delete-modal-input");
    document
      .getElementById("delete")
      .addEventListener("click", this.deleteOperation.bind(this));

    this.dateInputFromElement = document.getElementById("dateInputFrom");
    this.dateInputToElement = document.getElementById("dateInputTo");
    this.buttons = document.querySelectorAll(".buttons-filter button");
    const intervalButtonElement = document.getElementById("intervalButton");

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handlePeriodClick(e.target.textContent, e.target),
      );
    });

    document
      .getElementById("btn-create-expences")
      .addEventListener("click", (e) => {
        window.location.href = "#/operations/create?typeoperation=expense";
      });
    document
      .getElementById("btn-create-income")
      .addEventListener("click", (e) => {
        window.location.href = "#/operations/create?typeoperation=income";
      });
    this.initTable();
  }

  async initTable() {
    const dataFrom = new Date().toISOString().split("T")[0];
    const dataTo = new Date().toISOString().split("T")[0];
    await this.showOperationsWithFilter(dataFrom, dataTo);
  }

  clearStuleButtons() {
    this.buttons.forEach((button) => {
      button.classList.remove("btn-secondary");
      button.classList.add("btn-outline-secondary");
    });
  }

  handlePeriodClick(periodText, obj) {
    let startDate, endDate;
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
        startDate = this.dateInputFromElement.value
          ? this.dateInputFromElement.value
          : null;
        endDate = this.dateInputToElement.value
          ? this.dateInputToElement.value
          : null;
        break;
      default:
        return;
    }

    if (startDate && endDate) {
      this.showOperationsWithFilter(
        CommonUtils.convertDate2(startDate),
        CommonUtils.convertDate2(endDate),
      );
    } else {
      alert("Установите дату С и дату ПО!");
    }
  }

  async showOperationsWithFilter(dataFrom, dataTo) {
    const tableContainerElement = document.getElementById("table-container");
    this.clearOrerations(tableContainerElement);
    const response = await HttpUtils.request(
      "/operations?period=interval&dateFrom=" + dataFrom + "&dateTo=" + dataTo,
    );

    let i = 0;
    response.response.forEach((operation) => {
      i++;
      const tableRow = document.createElement("tr");
      const tds = [
        { content: i },
        {
          content: CommonUtils.getTypeTranslete(operation.type).type,
          classes: CommonUtils.getTypeTranslete(operation.type).class,
        },
        { content: operation.category },
        { content: operation.amount + " $" },
        { content: CommonUtils.convertDate(operation.date) },
        { content: operation.comment },
      ];
      tds.forEach((td) => {
        const cell = document.createElement("td");
        if (td.classes) {
          cell.classList.add(td.classes);
        }
        cell.textContent = td.content;
        tableRow.appendChild(cell);
      });

      const eventCell = document.createElement("td");
      eventCell.className = "table-col-event pe-0";
      const deleteLink = document.createElement("a");
      deleteLink.href = "javascript:void(0)";
      deleteLink.dataset.bsToggle = "modal";
      deleteLink.dataset.bsTarget = "#exampleModal";
      deleteLink.classList.add("table-btn-ico", "btn-delete");
      deleteLink.setAttribute("data-id", operation.id);
      deleteLink.addEventListener("click", function () {
        let id = this.getAttribute("data-id");

        document.getElementById("delete-modal-input").value = id;
      });

      const trashIcon = document.createElement("i");
      trashIcon.className = "bi bi-trash me-2";
      deleteLink.appendChild(trashIcon);
      eventCell.appendChild(deleteLink);
      const editLink = document.createElement("a");
      editLink.href = "/#/operations/edit?id=" + operation.id;
      editLink.className = "table-btn-ico";

      const pencilIcon = document.createElement("i");
      pencilIcon.className = "bi bi-pencil";
      editLink.appendChild(pencilIcon);
      eventCell.appendChild(editLink);

      tableRow.appendChild(eventCell);
      tableContainerElement.appendChild(tableRow);
    });
  }

  clearOrerations(element) {
    element.innerHTML = "";
  }

  async deleteOperation() {
    const response = await HttpUtils.request(
      "/operations/" + this.hiddenElement.value,
      "DELETE",
    );
    if (response.error) {
      alert("Ошибка удаления операции");
    } else {
      document.getElementById("balans").innerText =
        (await BalanceService.getBalance()) + "$";
      $("#exampleModal").modal("hide");
      window.location.href = "#/operations";
    }
  }
}
