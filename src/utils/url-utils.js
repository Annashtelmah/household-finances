export class UrlUtils {


  static getQueryParams() {
  
     return window.location.hash.split("?")[1];

    
  }


    static getUrlParam(param) {
    const urlParams = new URLSearchParams(this.getQueryParams());
    
    return urlParams.get(param);
  }
}
