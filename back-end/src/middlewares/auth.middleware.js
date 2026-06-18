const { verifyAccessToken } = require("../base/utils");

const authMiddleware = (userBl) => {
  return async (req, res, next) => {
    const authorization = req?.headers?.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Access token missed or malformed",
      });
    }
    const token = authorization.split(" ")[1];
    try {
      const decoded = verifyAccessToken(token);
      const user = await userBl.getUser(decoded.userId)
      if (!user) {
        throw new Error("User Not Found");
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      throw new Error("Token invalid or expired");
    }
  };
};

module.exports = authMiddleware;
