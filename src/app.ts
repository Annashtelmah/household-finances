import { Router } from "./router";
import type { RouteType } from "./types/route.type";
class App {
  private router:Router;
  constructor() {
    this.router = new Router();
    window.addEventListener(
      "DOMContentLoaded",
      this.handleRouterChange.bind(this),
    );
    window.addEventListener("popstate", this.handleRouterChange.bind(this));
    
  }

  handleRouterChange() {
    this.router.openRout();
  }
}

new App();
