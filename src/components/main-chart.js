import Chart from "chart.js/auto";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";

export class MainChart {
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

    this.dateInputFromElement = document.getElementById("dateInputFrom");
    this.dateInputToElement = document.getElementById("dateInputTo");
    this.buttons = document.querySelectorAll(".buttons-filter button");

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handlePeriodClick(e.target.textContent, e.target),
      );
    });
    this.init();
    // this.buttonsElements = $(".buttons-filter button");
    // this.buttonsElements.click((e) => {
    //   this.clearStuleButtons();
    //   $(e.target).removeClass("btn-outline-secondary");
    //   $(e.target).addClass("btn-secondary");
    // });
  }

  async init() {
    const dataFrom = new Date().toISOString().split("T")[0];
    const dataTo = new Date().toISOString().split("T")[0];
    await this.showChartsWithFilter(dataFrom, dataTo);
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
      this.showChartsWithFilter(
        CommonUtils.convertDate2(startDate),
        CommonUtils.convertDate2(endDate),
      );
    } else {
      alert("Установите дату С и дату ПО!");
    }
  }

  async showChartsWithFilter(dataFrom, dataTo) {
    let labels1 = [];
    let values1 = [];
    let backgroundColor1 = [];
    let labels2 = [];
    let values2 = [];
    let backgroundColor2 = [];
    let operationObj = {};

    const response = await HttpUtils.request(
      "/operations?period=interval&dateFrom=" + dataFrom + "&dateTo=" + dataTo,
    );
    if (!response.error && response.response && response.response.length > 0) {
      response.response.forEach((operation) => {
        if (operation.type === "income") {
          let category = operation.category
            ? operation.category
            : "Без категории";
          operationObj = CommonUtils.addOrUpdate(
            category,
            operation.amount,
            labels1,
            values1,
          );
          labels1 = operationObj.labelsArray;
          values1 = operationObj.valuesArray;
          backgroundColor1.push(CommonUtils.getRandomColor().toString());
        } else if (operation.type === "expense") {
          let category = operation.category
            ? operation.category
            : "Без категории";
          operationObj = CommonUtils.addOrUpdate(
            category,
            operation.amount,
            labels2,
            values2,
          );
          labels2 = operationObj.labelsArray;
          values2 = operationObj.valuesArray;
          backgroundColor2.push(CommonUtils.getRandomColor().toString());
        }
      });
    }
    if (values1.length === 0) {
      labels1.push("нет операций");
      values1.push(100);
      backgroundColor1.push("#cfcaca");
    }
    if (values2.length === 0) {
      labels2.push("нет операций");
      values2.push(100);
      backgroundColor2.push("#cfcaca");
    }
 
    CommonUtils.drawChart(
      "chart2",
      labels2,
      values2,
      backgroundColor2,
      "расход",
    );
    CommonUtils.drawChart(
      "chart1",
      labels1,
      values1,
      backgroundColor1,
      "доход",
    );
  }
}
