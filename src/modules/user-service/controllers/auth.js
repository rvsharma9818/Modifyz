const moment = require("moment")
const { verifyHash, generateHash, generatePassword } = require("../../../common/utils/helper");
const { AppError } = require("../../../common/utils/errorHandler");
const { generateToken } = require("../../../common/utils/generateToken");
const User = require("../models/User");
const { getUser } = require("./user");
const TempPassword = require('../models/TempPassword');


// Login user
const logIn = async (data) => {
  if (!data.email) {
    throw new AppError("logIn", "Email required", "custom", 422);
  }
  if (!data.password) {
    throw new AppError("logIn", "Password required", "custom", 422);
  }
  const user = await getUser({ email: data.email });
  if (!user) {
    throw new AppError("logIn", "User not found", "custom", 404);
  }
  if (!user.isActive) {
    throw new AppError("logIn", "Profile is not active", "custom", 502);
  }
  const isMatched = await verifyHash(data.password, user.password);
  if (!isMatched) {
    throw new AppError("logIn", "Incorrect password", "custom", 502);
  }
  const token = generateToken(user.userId, data.isRememberMe);
  return { token };
};

const forgotPassword = async (data) => {
  if (!data.email) {
    throw new AppError("forgotPassword", "Email required", "custom", 422);
  }
  const user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    throw new AppError("forgotPassword", "Email is not registered", "custom", 404);
  }

  const password = generatePassword();

  const tempPass = await TempPassword.create({ userId: user.userId, otp: password })

  return tempPass

}
const updatePassword = async (data) => {
  if (!data.userId) {
    throw new AppError("updatePassword", "user Id required", "custom", 422);
  }
  const tempPass = await TempPassword.findOne({ where: { userId: data.userId }, order: [['updatedAt', 'DESC']] });
  
  if (!tempPass) {
    throw new AppError("updatePassword", "Temporary password not exists", "custom", 404);
  }
  if (tempPass.otp != data.otp) {
    throw new AppError("updatePassword", "Temporary password is wrong!", "custom", 422);
  }
  const date1 = moment(tempPass.updatedAt)
  const date2 = moment()
  const diff = date2.diff(date1, 'minutes')

  if (diff >= 5) {
    throw new AppError("updatePassword", "Temporary password has expired!!", "custom", 422);
  }

  const userdata = await getUser({ userId: data.userId })
  userdata.password = data.newPassword;
  await userdata.save()
  return "New password has been updated successfully!!!"
}

// Change old password
const changePassword = async (user, data) => {

  if (!data.oldPassword) {
    throw new AppError("changePassword", "Old password is required", "custom", 422);
  }
  if (!data.newPassword) {
    throw new AppError("changePassword", "New password is required", "custom", 422);
  }
  const userData = await getUser({ userId: user.userId })
  if (!userData) {
    throw new AppError("changePassword", "User not registered!!", "custom", 404);
  }
  const checkPass = await verifyHash(data.oldPassword, userData.password)
  if (!checkPass) {
    throw new AppError("changePassword", "Old password is Incorrect!", "custom", 422);
  }
  userData.password = data.newPassword
  await userData.save()
  return "Password changed successfully!!"
}

module.exports = {
  logIn,
  forgotPassword,
  updatePassword,
  changePassword
};
