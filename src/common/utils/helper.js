const bcrypt = require("bcryptjs");
const { SALT_ROUNDS } = require("../constant");

const generatePassword = () => {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&";
  var passwordLength = 8;
  var password = "";
  for (var i = 1; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length + 1);
    password += chars.charAt(randomNumber);
  }
  return password;
};

async function generateHash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyHash(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

async function sendSuccessResponse(data, res) {
  return res.json({
    data,
    status: "success",
  });
}

module.exports = {
  generatePassword,
  generateHash,
  verifyHash,
  sendSuccessResponse,
};
