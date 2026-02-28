export class IncomeEdit {
  constructor() {
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/income";
    });
  }
}
