export class Expensescreate {
  constructor() {
    document.getElementById("cancel").addEventListener("click", () => {
      window.location.href = "#/expenses";
    });
  }
}
