export class ExpensesEdit {
  constructor() {
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/expenses";
    });
  }
}
