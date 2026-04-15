import { Chart } from "chart.js";
import { HttpUtils } from "./http-utils";
import type {
  CategoryTranslateType,
  CategoryType,
  ResponseCategoryType
} from "../types/categoty.type";
import type { ResultRequestType } from "../types/result-request.type";
import type { ResponseOperationType } from "../types/operations.type";
import type { ChartParamsType } from "../types/charts-params.type";

export class CommonUtils {
  public static createOptionForSelect(
    selectElement: HTMLSelectElement,
    arrayOptions: ResponseCategoryType[],
  ): void {
    for (let i = 0; i < arrayOptions.length; i++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = (arrayOptions[i] as ResponseCategoryType).id.toString();
      option.innerText = (arrayOptions[i] as ResponseCategoryType).title;
      selectElement.appendChild(option);
    }
  }
  public static clearOptionForSelect(selectElement: HTMLElement) {
    selectElement.innerHTML = "";
  }

  public static changeActivMemu(activType: string) {
    const incomeLinkElement: HTMLElement | null =
      document.getElementById("income-link");
    const expensesLinkElement: HTMLElement | null =
      document.getElementById("expenses-link");
    const categoriesLinkElement: HTMLElement | null =
      document.getElementById("categories-link");
    if (categoriesLinkElement) {
      categoriesLinkElement.classList.add("text-white");
      categoriesLinkElement.classList.add("bg-primary");
      categoriesLinkElement.classList.remove("text-primary-emphasis");
    }

    if (activType === "expense") {
      if (expensesLinkElement) {
        expensesLinkElement.classList.add("text-white");
        expensesLinkElement.classList.remove("text-primary-emphasis");
        expensesLinkElement.classList.add("bg-primary");
      }
      if (incomeLinkElement) {
        incomeLinkElement.classList.remove("text-white");
        incomeLinkElement.classList.add("text-primary-emphasis");
        incomeLinkElement.classList.remove("bg-primary");
      }
    } else if (activType === "income") {
      if (incomeLinkElement) {
        incomeLinkElement.classList.add("text-white");
        incomeLinkElement.classList.remove("text-primary-emphasis");
        incomeLinkElement.classList.add("bg-primary");
      }
      if (expensesLinkElement) {
        expensesLinkElement.classList.remove("text-white");
        expensesLinkElement.classList.add("text-primary-emphasis");
        expensesLinkElement.classList.remove("bg-primary");
      }
    }
  }

  public static getTypeTranslete(
    type: CategoryType,
  ): CategoryTranslateType | false {
    if (type === "income") {
      return { type: "Доход", class: "text-success" };
    }
    if (type === "expense") {
      return { type: "Расход", class: "text-danger" };
    } else return false;
  }

  static convertDate(date: string):string {
    //из формата yyyy-mmm-dd в формат dd.mm.yyyy
    let parts = date.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  static convertDate2(dateStr: string):string|undefined {
    //из формата dd.mm.yyyy в формат yyyy-mmm-dd
    const date: string | undefined = dateStr.split(",")[0];
    if (date) {
      dateStr = date;
    }
    const parts: number[] = dateStr.split(".").map(Number);
    if (parts[0] && parts[1]) {
      const isoFormat = `${parts[2]}-${parts[1].toString().padStart(2, "0")}-${parts[0].toString().padStart(2, "0")}`;
      return new Date(isoFormat).toISOString().split("T")[0];
    }
  }

  //функция для запроса категорий
  public static async getCaregories(type: CategoryType): Promise<any> {
    const response: ResultRequestType = await HttpUtils.request(
      "/categories/" + type,
    );
    if (!response.error && response.response) {
      return response.response;
    } else {
      alert("Ошибка получения категорий!");
    }
  }

  public static getRandomColor(): string {
    return "#" + ((Math.random() * 0xffffff) | 0).toString(16).padStart(6, "0");
  }

  public static drawChart(
    canvasId: string,
    dataLabels: string[],
    dataValues: number[],
    backgroundColor: string[],
    label: string,
  ): void {
    const canvasElement: HTMLCanvasElement | null = document.getElementById(
      canvasId,
    ) as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        const existingChart = Chart.getChart(ctx);

        if (existingChart && existingChart.data.datasets[0]) {
          // Если диаграмма существует — обновляем данные и перерисовываем
          existingChart.data.labels = dataLabels;
          existingChart.data.datasets[0].data = dataValues;
          existingChart.data.datasets[0].backgroundColor = backgroundColor;
          existingChart.data.datasets[0].label = label;
          existingChart.update(); // Перерисовка без пересоздания
        } else {
          new Chart(ctx, {
            type: "pie",
            data: {
              labels: dataLabels,
              datasets: [
                {
                  label: label,
                  data: dataValues,
                  backgroundColor: backgroundColor,
                  hoverOffset: 10,
                  borderWidth: 2,
                },
              ],
            },
          });
        }
      }
    }
  }

  public static addOrUpdate(
    label: string,
    value: number,
    labelsArray: string[],
    valuesArray: number[],
  ): ChartParamsType {
    const index: number = labelsArray.indexOf(label);
    if (index && index !== -1 && valuesArray[index]) {
      valuesArray[index] =
        parseInt((valuesArray[index] as number).toString()) + parseInt(value.toString());
    } else {
      labelsArray.push(label);
      valuesArray.push(value);
    }
    return { labelsArray: labelsArray, valuesArray: valuesArray };
  }
}
