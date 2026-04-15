import { Expensescreate } from "./components/expenses-create";
import { ExpensesEdit } from "./components/expenses-edit";
import { Expenses } from "./components/expenses";
import { Operations } from "./components/operations";
import { IncomeCreate } from "./components/Income-create";
import { IncomeEdit } from "./components/Income-edit";
import { Income } from "./components/income";
import { Login } from "./components/login";
import { MainChart } from "./components/main-chart";
import { SingUp } from "./components/sing-up";
import { OperationsEdit } from "./components/operations-edit";
import { OperationsCreate } from "./components/operations-create";
import { Logout } from "./components/logout";
import { AuthUtils } from "./utils/auth-utils";
import { BalanceService } from "./services/balance-servis";
import type { RouteType } from "./types/route.type";
import type { UserInfoType } from "./types/auth.type";

export class Router {
 private contentElement: HTMLElement | null;
 private titleElement: HTMLElement | null;
 private stylesElement: HTMLElement | null;
  private routes: Array<RouteType>;

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
        route: "#/expenses/create",
        title: "Категории расходов",
        template: "templates/expenses-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expensescreate();
        },
      },
    ];
  }

  public async openRout(): Promise<void> {
    const urlRout: string | undefined = window.location.hash.split("?")[0];

    const newRout: RouteType | undefined = this.routes.find((item) => {
      return item.route === urlRout;
    });
    if (!newRout) {
      window.location.href = "#/login";
      return;
    }

    if (newRout.template) {
      let contentBlock: HTMLElement | null = this.contentElement;
      if (newRout.useLayout) {
        if (this.contentElement) {
          this.contentElement.innerHTML = await fetch(newRout.useLayout).then(
            (response) => response.text(),
          );
        }

        contentBlock = document.getElementById("content-layout");
        this.activateMenuItem(newRout);
        const sidebarElement: HTMLElement | null =
          document.getElementById("sidebar");
        const toggleElement: HTMLElement | null =
          document.getElementById("toggle");
        if (toggleElement && sidebarElement) {
          toggleElement.addEventListener("click", () => {
            sidebarElement.classList.add("sidebarVisible");
          });
        }
        const closeBtnElement: HTMLElement | null =
          document.getElementById("close-btn");
        if (closeBtnElement && sidebarElement) {
          closeBtnElement.addEventListener("click", () => {
            sidebarElement.classList.remove("sidebarVisible");
          });
        }

        //document.getElementById("closeLink").addEventListener("click", (e) => {});
        const exitElement: HTMLElement | null = document.getElementById("exit");
        if (exitElement) {
          exitElement.addEventListener("click", () => {
            window.location.href = "#/logout";
          });
        }

        const userInfo: UserInfoType = JSON.parse(
          AuthUtils.getAuthInfo("userInfo") as string,
        );
        if (!userInfo) {
          window.location.href = "#/login";
        } else if (userInfo.name && userInfo.lastName) {
          const userNameElement: HTMLElement | null =
            document.getElementById("user-name");
          if (userNameElement) {
            userNameElement.innerText = userInfo.name + " " + userInfo.lastName;
          }
        }

        //запрос баланса
        const balanceElement: HTMLElement | null =
          document.getElementById("balans");
        if (balanceElement) {
          balanceElement.innerText = (await BalanceService.getBalance()) + "$";
        }
      }
      if (contentBlock) {
        contentBlock.innerHTML = await fetch(newRout.template).then(
          (response) => response.text(),
        );
      }
    }
    if (newRout.styles && this.stylesElement) {
      this.stylesElement.setAttribute("href", newRout.styles);
    }
    if (this.titleElement && newRout.title) {
      this.titleElement.innerText = newRout.title;
    }

    if (newRout.load && typeof newRout.load === "function") {
      newRout.load();
    } else {
      window.location.href = "#/";
    }
  }

  private activateMenuItem(route: RouteType): void {
    const collapseExampleElement: HTMLElement | null =
      document.getElementById("collapseExample");
    const linkCollapseElement: HTMLElement | null =
      document.getElementById("link-collapse");
    const categoriesLinkElement: HTMLElement | null =
      document.getElementById("categories-link");
    if (categoriesLinkElement) {
      const icon: HTMLElement | null =
        categoriesLinkElement.querySelector(".rotate");
      categoriesLinkElement.addEventListener("click", (e) => {
        //collapseExampleElement.classList.remove("show");
        if (icon) {
          if (!icon.classList.contains("rotated")) {
            icon.classList.add("rotated");
          } else {
            icon.classList.remove("rotated");
          }
        }
      });
    }

    document.querySelectorAll(".sidebar .menu-item").forEach((item) => {
      const href: string | null = item.getAttribute("href");
      if (
        (href && route.route.includes(href) && href !== "#/") ||
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
          if (linkCollapseElement) {
            linkCollapseElement.classList.add("border");
            linkCollapseElement.classList.add("border-primary");
          }
          if (categoriesLinkElement) {
            categoriesLinkElement.classList.add("text-white");
            categoriesLinkElement.classList.add("bg-primary");
            categoriesLinkElement.classList.remove("text-primary-emphasis");
          }
          if (collapseExampleElement) {
            collapseExampleElement.classList.add("show");
          }
          if (categoriesLinkElement) {
            const icon: HTMLElement | null =
              categoriesLinkElement.querySelector(".rotate");
            if (icon) {
              icon.classList.add("rotated");
            }
          }
        }
      } else {
        item.classList.remove("text-white");
        item.classList.add("text-primary-emphasis");
        item.classList.remove("bg-primary");
      }
    });
  }
}
