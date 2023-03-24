const Router = require("express").Router();
const { sendSuccessResponse } = require("../../../common/utils/helper");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const {authToken} = require('../../../common/middlewares/authToken')

// Register User
Router.post("/", async (req, res, next) => {
  try {
    const data = await userController.createUser(req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST users/";
    next(error);
  }
});

// Create password
Router.patch("/", async (req, res, next) => {
  try {
    const data = await userController.createPassword(req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "PATCH users/";
    next(error);
  }
});

// forgot password email send
Router.post("/forgotPassword", async (req, res, next) => {
  try {
    const data = await authController.forgotPassword(req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST users/forgotPassword";
    next(error);
  }
});

// update password in database
Router.patch("/forgotPassword", async (req, res, next) => {
  try {
    const data = await authController.updatePassword(req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "Patch users/updatePassword";
  }
})

// Login user
Router.post("/login", async (req, res, next) => {
  try {
    const data = await authController.logIn(req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST users/login";
    next(error);
  }
});

// Change password
Router.post("/changePassword",authToken,async (req, res, next) => {
  try {
    const data = await authController.changePassword(req.user,req.body);
    await sendSuccessResponse(data, res);
  } catch (error) {
    error.reference = error.reference ? error.reference : "POST users/changePassword";
    next(error);
  }
});

module.exports = Router;
