import { AuthService } from "../services/auth-service";
import { AuthUtils } from "../utils/auth-utils";

export class Logout {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    if (
      !AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ||
      !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
    ) {
      window.location.href = "#/login";
      return;
    }
    this.Logout();
  }

  async Logout() {
    await AuthService.logOut({
      refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
    });

    AuthUtils.removeAuthInfo();
      window.location.href = "#/login";
  }
}
