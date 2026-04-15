import Chart, { elements } from "chart.js/auto";
import { CommonUtils } from "../utils/common-utils";
import { HttpUtils } from "../utils/http-utils";
import type { ResultRequestType } from "../types/result-request.type";
import type { ResponseOperationType } from "../types/operations.type";
import type { ChartParamsType } from "../types/charts-params.type";

export class MainChart {
  private dateInputFromElement: HTMLInputElement | null = null;
  private dateInputToElement: HTMLInputElement | null = null;
  private buttons: NodeListOf<HTMLElement> | null = null;

  constructor() {
    (<any>$("#dateInputFrom"))
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", (e: any) => {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });
    (<any>$("#dateInputTo"))
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", (e: any) => {
        $(this).css("width", "120px");
        $("#intervalButton").trigger("click");
      });

    this.dateInputFromElement = document.getElementById(
      "dateInputFrom",
    ) as HTMLInputElement;
    this.dateInputToElement = document.getElementById(
      "dateInputTo",
    ) as HTMLInputElement;
    this.buttons = document.querySelectorAll(".buttons-filter button");

    this.buttons.forEach((button: HTMLElement) => {
      button.addEventListener("click", (e: any) =>
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

  private async init(): Promise<void> {
    const dataFrom: string | undefined = new Date().toISOString().split("T")[0];
    const dataTo: string | undefined = new Date().toISOString().split("T")[0];
    if (dataFrom && dataTo) {
      await this.showChartsWithFilter(dataFrom, dataTo);
    }
  }

  private clearStuleButtons(): void {
    if (this.buttons) {
      this.buttons.forEach((button: HTMLElement) => {
        button.classList.remove("btn-secondary");
        button.classList.add("btn-outline-secondary");
      });
    }
  }

  private handlePeriodClick(periodText: string, obj: HTMLElement) {
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

    if (startDate && endDate) {
      this.showChartsWithFilter(
        CommonUtils.convertDate2(startDate) as string,
        CommonUtils.convertDate2(endDate) as string,
      );
    } else {
      alert("Установите дату С и дату ПО!");
    }
  }

  private async showChartsWithFilter(dataFrom:string, dataTo:string):Promise<void> {
    let labels1:string[] = [];
    let values1:number[] = [];
    let backgroundColor1:string[] = [];
    let labels2:string[]= [];
    let values2:number[] = [];
    let backgroundColor2:string[] = [];
    let operationObj:ChartParamsType = {
      labelsArray:[],
      valuesArray:[]
    };

    const response:ResultRequestType = await HttpUtils.request(
      "/operations?period=interval&dateFrom=" + dataFrom + "&dateTo=" + dataTo,
    );
    if (!response.error && response.response && (response.response as Array<ResponseOperationType>).length > 0) {
      (response.response  as Array<ResponseOperationType>).forEach((operation:ResponseOperationType) => {
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
