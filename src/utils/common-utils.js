import { Chart } from "chart.js";
import { HttpUtils } from "./http-utils";

export class CommonUtils {
  static createOptionForSelect(selectElement, arrayOptions) {
    for (let i = 0; i < arrayOptions.length; i++) {
      const option = document.createElement("option");
      option.value = arrayOptions[i].id;
      option.innerText = arrayOptions[i].title;
      selectElement.appendChild(option);
    }
  }
  static clearOptionForSelect(selectElement) {
    selectElement.innerHTML = "";
  }

  static changeActivMemu(activType) {
    const incomeLinkElement = document.getElementById("income-link");
    const expensesLinkElement = document.getElementById("expenses-link");
    const categoriesLinkElement = document.getElementById("categories-link");
    categoriesLinkElement.classList.add("text-white");
    categoriesLinkElement.classList.add("bg-primary");
    categoriesLinkElement.classList.remove("text-primary-emphasis");
    if (activType === "expense") {
      expensesLinkElement.classList.add("text-white");
      expensesLinkElement.classList.remove("text-primary-emphasis");
      expensesLinkElement.classList.add("bg-primary");
      incomeLinkElement.classList.remove("text-white");
      incomeLinkElement.classList.add("text-primary-emphasis");
      incomeLinkElement.classList.remove("bg-primary");
    } else if (activType === "income") {
      incomeLinkElement.classList.add("text-white");
      incomeLinkElement.classList.remove("text-primary-emphasis");
      incomeLinkElement.classList.add("bg-primary");
      expensesLinkElement.classList.remove("text-white");
      expensesLinkElement.classList.add("text-primary-emphasis");
      expensesLinkElement.classList.remove("bg-primary");
    }
  }

  static getTypeTranslete(type) {
    if (type === "income") {
      return { type: "Доход", class: "text-success" };
    }
    if (type === "expense") {
      return { type: "Расход", class: "text-danger" };
    } else return false;
  }

  static convertDate(date) {
    //из формата yyyy-mmm-dd в формат dd.mm.yyyy
    let parts = date.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  static convertDate2(dateStr) {
    //из формата dd.mm.yyyy в формат yyyy-mmm-dd
    dateStr = dateStr.split(",")[0];
    const parts = dateStr.split(".").map(Number);
    const isoFormat = `${parts[2]}-${parts[1].toString().padStart(2, "0")}-${parts[0].toString().padStart(2, "0")}`;
    return new Date(isoFormat).toISOString().split("T")[0];
  }

  //функция для запроса категорий
  static async getCaregories(type) {
    const response = await HttpUtils.request("/categories/" + type);
    if (!response.error && response.response) {
      return response.response;
    } else {
      alert("Ошибка получения категорий!");
    }
  }

  static getRandomColor() {
    return "#" + ((Math.random() * 0xffffff) | 0).toString(16).padStart(6, "0");
  }

  static drawChart(canvasId, dataLabels, dataValues, backgroundColor, label) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
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

  static addOrUpdate(label, value, labelsArray, valuesArray) {
    const index = labelsArray.indexOf(label);
    if (index !== -1) {
      valuesArray[index] = (parseInt(valuesArray[index]) + parseInt(value));
    } else {
      labelsArray.push(label);
      valuesArray.push(value.toString());
    }
    return { labelsArray: labelsArray, valuesArray: valuesArray };
  }
}
