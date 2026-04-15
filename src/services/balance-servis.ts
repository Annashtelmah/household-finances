import type { BalanceType} from "../types/balance.type";
import type { ResultRequestType } from "../types/result-request.type";
import { HttpUtils } from "../utils/http-utils";

export class BalanceService {
  public static async getBalance(): Promise<number> {
    const result: ResultRequestType = await HttpUtils.request("/balance");
    // if (
    //   result.error ||
    //   !result.response ||
    //   (result.response && !result.response.balance)
    // ) {
    //   return 0;
    // }
    // return result.response.balance;
    if (result.error || !result.response) {
      return 0;
    } else {
      return (result.response as BalanceType).balance;
    }
  }
}
