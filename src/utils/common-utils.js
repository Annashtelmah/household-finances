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
    selectElement.innerHTML='';
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
}
