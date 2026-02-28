import Chart from "chart.js/auto";

export class MainChart {
  constructor() {
    this.initChart();
    $("#dateInputFrom")
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", function (e) {
        $(this).css("width", "120px");
      });
    $("#dateInputTo")
      .datepicker({
        format: "dd.mm.yyyy",
        language: "ru",
      })
      .on("changeDate", function (e) {
        $(this).css("width", "120px");
      });

    this.buttonsElements = $(".buttons-filter button");
    this.buttonsElements.click((e) => {
      this.clearStuleButtons();
      $(e.target).removeClass("btn-outline-secondary");
      $(e.target).addClass("btn-secondary");
    });
  }
  clearStuleButtons(){
    this.buttonsElements.removeClass("btn-secondary");
    this.buttonsElements.addClass("btn-outline-secondary");
  }


  initChart() {
    function drawChart(
      canvasId,
      dataLabels,
      dataValues,
      backgroundColor,
      label,
    ) {
      const ctx = document.getElementById(canvasId).getContext("2d");
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

    let labels1 = [
      "Зарплата",
      "Депозиты",
      "Инвестиции",
      "Сбережения",
      "Подработка",
    ];
    let values1 = [20, 10, 20, 70, 50];
    let backgroundColor1 = [
      "#20C997",
      "#0D6EFD",
      "#FFC107",
      "#FD7E14",
      "#DC3545",
    ];
    drawChart("chart1", labels1, values1, backgroundColor1, "доход");

    let labels2 = ["Еда", "Одежда", "Спорт", "Жилье", "Авто"];
    let values2 = [80, 20, 20, 40, 15];
    let backgroundColor2 = [
      "#DC3545",
      "#FD7E14",
      "#20C997",
      "#0D6EFD",
      "#FFC107",
    ];
    drawChart("chart2", labels2, values2, backgroundColor2, "расход");
  }
}
