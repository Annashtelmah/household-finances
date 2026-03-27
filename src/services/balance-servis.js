import { HttpUtils } from "../utils/http-utils";


export class BalanceService {
  static async getBalance() {
    const result = await HttpUtils.request("/balance");
    if (
      result.error ||
      !result.response ||
      (result.response && !result.response.balance)) 
      {
      return false;
    }
    return result.response.balance;
  }
}