export class Operations {
  constructor() {
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

    document.getElementById("btn-create-expences").addEventListener("click",(e)=>{
      window.location.href="#/operations/create?typeoperation=expense";
    });
     document.getElementById("btn-create-income").addEventListener("click",(e)=>{
      window.location.href="#/operations/create?typeoperation=income";
    });
  }


  clearStuleButtons() {
    this.buttonsElements.removeClass("btn-secondary");
    this.buttonsElements.addClass("btn-outline-secondary");
  }
}
