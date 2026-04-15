export class UrlUtils {


 public static getQueryParams():string|undefined {
  
     return window.location.hash.split("?")[1];

    
  }


  public  static getUrlParam(param:string):string|null {
    const urlParams = new URLSearchParams(this.getQueryParams());
    
    return urlParams.get(param);
  }
}
