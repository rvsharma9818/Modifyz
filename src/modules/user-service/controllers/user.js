const db = require("../../../common/db/database");
const moment = require('moment')
const { generatePassword, verifyHash } = require("../../../common/utils/helper");
const { AppError } = require("../../../common/utils/errorHandler");
const User = require("../models/User");
const UserInformation = require("../models/UserInformation");


// Create user
const createUser = async (data) => {
  if (!data.email) {
    throw new AppError("createUser", "Email required", "custom", 422);
  }
  const user = await getUser({ email: data.email });
  if (user) {
    throw new AppError("createUser", "Email already registered", "custom", 422);
  }
  const password = generatePassword();
  const transaction = await db.sequelize.transaction();
  let response = {};
  try {
    let userCreate = await User.create(
      { email: data.email, password },
      { transaction }
    );
    let userInformation = await UserInformation.create(
      {
        userId: userCreate.userId,
      },
      { transaction }
    );
    userCreate.password = password;
    response.userCreate = userCreate;
    response.userInformation = userInformation;
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new AppError(
      "createUser",
      "Error while creating user",
      "custom",
      422
    );
  }
  return response;
};

// To create user password
const createPassword = async (data) => {
  if (!data.email) {
    throw new AppError("createPassword", "Email required", "custom", 422);
  }
  if (!data.password) {
    throw new AppError("createPassword", "Password required", "custom", 422);
  }
  if (!data.newPassword) {
    throw new AppError(
      "createPassword",
      "New password required",
      "custom",
      422
    );
  }
  let user = await User.findOne({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new AppError("createPassword", "User doesn't exist", "custom", 404);
  }
  const isMatched = await verifyHash(data.password, user.password);
  if (!isMatched) {
    throw new AppError(
      "createPassword",
      "Password doesn't matched",
      "custom",
      404
    );
  }
  user.password = data.newPassword;
  user.isActive = true;
  await user.save();
  return "New password saved";
};



async function getUser(params) {
  return await User.findOne({ where: params });
}



module.exports = {
  createUser,
  createPassword,
  getUser,
};
