export class UrlUtils {


  static getQueryParams() {
    console.log(window.location.hash.split("?")[1])
     return window.location.hash.split("?")[1];

    
  }


    static getUrlParam(param) {
    const urlParams = new URLSearchParams(this.getQueryParams());
    console.log(urlParams.get(param));
    return urlParams.get(param);
  }
}
