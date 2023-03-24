const jwt = require("jsonwebtoken");
const { getUser } = require("../../modules/user-service/controllers/user");
const { AppError } = require("../utils/errorHandler");
const SECRET = process.env.TOKEN_SECRET;

module.exports.authToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (typeof token !== "undefined") {
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      try {
        const decodedData = jwt.verify(token, SECRET);
        const { id } = decodedData;
        const user = await getUser({ userId: id });
        if (user) {
          if (!user.isActive) {
            return next(
              new AppError(
                "authToken",
                "Profile not active. Please contact admin",
                "custom",
                401
              )
            );
          }
          req.user = user
          next();
        } else {
          return next(
            new AppError("authToken", "User not found", "custom", 401)
          );
        }
      } catch (error) {
        return next(new AppError("authToken", "Invalid token.", "custom", 401));
      }
    } else {
      return next(new AppError("authToken", "Missing token", "custom", 401));
    }
  } else {
    return next(new AppError("authToken", "Missing header", "custom", 401));
  }
};
