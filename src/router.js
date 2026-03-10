import { Expensescreate } from "./components/expenses-create.js";
import { ExpensesEdit } from "./components/expenses-edit.js";
import { Expenses } from "./components/expenses.js";
import { Operations, Opirations } from "./components/operations.js";
import { IncomeCreate } from "./components/Income-create.js";
import { IncomeEdit } from "./components/Income-edit.js";
import { Income } from "./components/income.js";
import { Login } from "./components/login.js";
import { MainChart } from "./components/main-chart.js";
import { SingUp } from "./components/sing-up.js";
import { OperationsEdit } from "./components/operations-edit.js";
import { OperationsCreate } from "./components/operations-create.js";
import { Logout } from "./components/logout.js";
import { AuthUtils } from "./utils/auth-utils.js";

export class Router {
  constructor() {
    this.contentElement = document.getElementById("content");
    this.titleElement = document.getElementById("page-title");
    this.stylesElement = document.getElementById("styles");

    this.routes = [
      {
        route: "#/",
        title: "Главная",
        template: "templates/main-chart.html",
        styles: "styles/main-chart.css",
        useLayout: "templates/layout.html",
        load: () => {
          new MainChart();
        },
      },
      {
        route: "#/404",
        title: "Страница не найдена",
        template: "templates/404.html",
        useLayout: false,
        load: () => {},
      },
      {
        route: "#/login",
        title: "Авторизация",
        template: "templates/login.html",
        useLayout: false,
        load: () => {
          new Login();
        },
      },
      {
        route: "#/sing-up",
        title: "Регистрация",
        template: "templates/sing-up.html",
        useLayout: false,
        load: () => {
          new SingUp();
        },
      },
      {
        route: "#/logout",
        useLayout: false,
        load: () => {
          new Logout();
        },
      },

      {
        route: "#/operations",
        title: "Доходы и расходы",
        template: "templates/operations.html",
        styles: "styles/operations.css",
        useLayout: "/templates/layout.html",
        load: () => {
          new Operations();
        },
      },
      {
        route: "#/operations/edit",
        title: "Редактирование дохода/расхода",
        template: "templates/operations-edit.html",
        styles: "styles/operations.css",
        useLayout: "/templates/layout.html",
        load: () => {
          new OperationsEdit();
        },
      },
      {
        route: "#/operations/create",
        title: "Создание дохода/расхода",
        template: "templates/operations-create.html",
        styles: "styles/operations.css",
        useLayout: "/templates/layout.html",
        load: () => {
          new OperationsCreate();
        },
      },
      {
        route: "#/income",
        title: "Категории доходов",
        template: "templates/income.html",
        styles: "styles/income.css",
        useLayout: "/templates/layout.html",
        load: () => {
          new Income();
        },
      },
      {
        route: "#/income/edit",
        title: "Редактирование категории доходов",
        template: "templates/income-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new IncomeEdit();
        },
      },
      {
        route: "#/income/create",
        title: "Категории доходов",
        template: "templates/income-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new IncomeCreate();
        },
      },
      {
        route: "#/expenses",
        title: "Категории расходов",
        template: "templates/expenses.html",
        styles: "styles/expenses.css",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expenses();
        },
      },
      {
        route: "#/expenses/edit",
        title: "Категории расходов",
        template: "templates/expenses-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesEdit();
        },
      },
      {
        route: "#/expenses/cteate",
        title: "Категории расходов",
        template: "templates/expenses-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expensescreate();
        },
      },
    ];
  }

  async openRout() {
    const urlRout = window.location.hash.split("?")[0];

    const newRout = this.routes.find((item) => {
      return item.route === urlRout;
    });
    if (!newRout) {
      window.location.href = "#/login";
      return;
    }

    if (newRout.template) {
      let contentBlock = this.contentElement;
      if (newRout.useLayout) {
        this.contentElement.innerHTML = await fetch(newRout.useLayout).then(
          (response) => response.text(),
        );
        contentBlock = document.getElementById("content-layout");
        this.activateMenuItem(newRout);
        const sidebarElement = document.getElementById("sidebar");

        document.getElementById("toggle").addEventListener("click", () => {
          sidebarElement.classList.add("sidebarVisible");
        });
        document.getElementById("close-btn").addEventListener("click", () => {
          sidebarElement.classList.remove("sidebarVisible");
        });
        document
          .getElementById("closeLink")
          .addEventListener("click", (e) => {});

        document.getElementById("exit").addEventListener("click", () => {
          window.location.href = "#/logout";
        });
        const userInfo = JSON.parse(AuthUtils.getAuthInfo("userInfo"));
        if (!userInfo) {
          window.location.href = "#/login";
        } else if (userInfo.name && userInfo.lastName) {
          document.getElementById("user-name").innerText =
            userInfo.name + " " + userInfo.lastName;
        }
      }
      contentBlock.innerHTML = await fetch(newRout.template).then((response) =>
        response.text(),
      );
    }
    if (newRout.styles) {
      this.stylesElement.setAttribute("href", newRout.styles);
    }

    this.titleElement.innerText = newRout.title;

    // const userInfo = Auth.getUserInfo();
    // const accessToken = localStorage.getItem(Auth.accessTokenKey);
    // if (userInfo && accessToken) {
    //   this.profileElement.style.display = "flex";
    //   this.profilefullNameElement.innerText = userInfo.fullName;
    // } else {
    //   this.profileElement.style.display = "none";
    // }

    if (newRout.load && typeof newRout.load === "function") {
      newRout.load();
    } else {
      console.log("no route find");
      window.location.href = "#/";
    }
  }

  activateMenuItem(route) {
    const collapseExampleElement = document.getElementById("collapseExample");
    const linkCollapseElement = document.getElementById("link-collapse");
    const categoriesLinkElement = document.getElementById("categories-link");
    const icon = categoriesLinkElement.querySelector(".rotate");
    categoriesLinkElement.addEventListener("click", (e) => {
      //collapseExampleElement.classList.remove("show");
      if (!icon.classList.contains("rotated")) {
        icon.classList.add("rotated");
      } else {
        icon.classList.remove("rotated");
      }
    });

    document.querySelectorAll(".sidebar .menu-item").forEach((item) => {
      const href = item.getAttribute("href");
      if (
        (route.route.includes(href) && href !== "#/") ||
        (route.route === "#/" && href === "#/")
      ) {
        if (
          !route.route.includes("#/operations/create") &&
          !route.route.includes("#/operations/edit")
        ) {
          item.classList.add("text-white");
          item.classList.remove("text-primary-emphasis");
          item.classList.add("bg-primary");
        } else {
        }
        if (
          route.route.includes("#/income") ||
          route.route.includes("#/expenses") ||
          route.route.includes("#/operations/create") ||
          route.route.includes("#/operations/edit")
        ) {
          linkCollapseElement.classList.add("border");
          linkCollapseElement.classList.add("border-primary");
          categoriesLinkElement.classList.add("text-white");
          categoriesLinkElement.classList.add("bg-primary");
          categoriesLinkElement.classList.remove("text-primary-emphasis");
          collapseExampleElement.classList.add("show");
          icon.classList.add("rotated");
        }
      } else {
        item.classList.remove("text-white");
        item.classList.add("text-primary-emphasis");
        item.classList.remove("bg-primary");
      }
    });
  }
}
