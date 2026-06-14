const errorFactory = require("sillajError");
const { operationMessages, codes, refreshTokenExpire } = require("../../base/enums");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, comparePassword } = require("../../base/utils");

class AuthBl {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  register = async (data) => {
    const countUsers = await this.authRepo.count({});
    if (countUsers > 0) {
      throw errorFactory.RegistrationLimitExceeded(
        operationMessages["auth.registration_limit_exceeded"].fa,
      );
    }
    await this.authRepo.create({
      ...data,
      permissions: ['*'],
    });
    return true;
  };

  login = async (data) => {
    const { username, password } = data;
    const user = await this.authRepo.findOne({ username });
    if (!user) {
      throw errorFactory.NotFound(
        operationMessages["auth.invalid_credentials"].fa,
      );
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw errorFactory.NotFound(
        operationMessages["auth.invalid_credentials"].fa,
      );
    }
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    await this.authRepo.saveTokenInCache(
      `refreshToken:${user._id}`,
      refreshToken,
      refreshTokenExpire,
    );
    return { accessToken, refreshToken };
  };

  refreshToken = async (data) => {
    const { refreshToken } = data;
    const decodedToken = verifyRefreshToken(refreshToken);
    const user = await this.authRepo.findById(decodedToken.userId);
    if (!user) {
      throw errorFactory.NotFound(operationMessages["common.user_not_found"]);
    }
    const redisKey = `refreshToken:${user._id}`;
    const tokenExists = await this.authRepo.existsTokenInCache(redisKey);
    if (!tokenExists) {
      throw errorFactory.CustomError({
        message: operationMessages["auth.refresh_token.invalid_token"],
        statusCode: 401,
        code: codes.invalid_refresh_token,
      });
    }
    await this.authRepo.deleteTokenFromCache(redisKey);
    const newRefreshToken = generateRefreshToken({ userId: user._id });
    const accessToken = generateAccessToken({ userId: user._id });
    await this.authRepo.saveTokenInCache(
      redisKey,
      newRefreshToken,
      refreshTokenExpire,
    );
    return { accessToken, refreshToken: newRefreshToken };
  };

  logout = async (user) => {
    const { _id } = user;
    const redisKey = `refreshToken:${_id}`;
    const refreshToken = await this.authRepo.existsTokenInCache(redisKey);
    if (refreshToken) await this.authRepo.deleteTokenFromCache(redisKey);
  };
}

module.exports = AuthBl;
