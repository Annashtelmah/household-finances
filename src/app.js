import { Router } from "./router.js";
class App {
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
