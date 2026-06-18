const { operationMessages } = require("../../base/enums");

class AuthController {
  constructor(authBl) {
    this.authBl = authBl;
  }

  register = async (req, res, next) => {
    const data = req.body;
    await this.authBl.register(data);
    return res.sendResponse(201, {
      message: operationMessages["auth.register.success"],
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  login = async (req, res, next) => {
    const data = req.body;
    const { accessToken, refreshToken } = await this.authBl.login(data);
    return res.sendResponse(200, {
      message: operationMessages["auth.login.success"],
      username: data.username,
      accessToken,
      refreshToken,
    });
  };

  refreshToken = async (req, res, next) => {
    const data = req.body;
    const { accessToken, refreshToken } = await this.authBl.refreshToken(data);
    return res.sendResponse(200, {
      message: operationMessages["auth.refresh_token.revoked_success"],
      accessToken,
      refreshToken,
    });
  };

  getMe = async (req, res, next) => {
    const user = req?.user;
    return res.sendResponse(200, {
      message: operationMessages["auth.get_me.success"],
      user,
    });
  };

  logout = async (req, res, next) => {
    const user = req?.user;
    await this.authBl.logout(user);
    return res.sendResponse(200, {
      message: operationMessages["auth.logout.success"],
    });
  };
}

module.exports = AuthController;
