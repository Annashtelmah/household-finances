import { AuthService } from "../services/auth-service";
import { AuthUtils } from "../utils/auth-utils";

export class Logout {
  constructor() {

    if (
      !AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ||
      !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
    ) {
      window.location.href = "#/login";
      return;
    }
    this.Logout();
  }

 private async Logout():Promise<void> {
    await AuthService.logOut({
      refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) as string
    });

    AuthUtils.removeAuthInfo();
      window.location.href = "#/login";
  }
}
