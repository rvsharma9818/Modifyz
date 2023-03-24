const jwt = require("jsonwebtoken");

const SECRET = process.env.TOKEN_SECRET;

const generateToken = (id, isRememberMe) => {
  let expiry = "";
  if (isRememberMe) {
    expiry = "30d";
  } else {
    expiry = "1d";
  }
  return jwt.sign({ id }, SECRET, { expiresIn: expiry });
};

module.exports = {
  generateToken,
};
