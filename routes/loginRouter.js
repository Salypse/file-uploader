const express = require("express");
const passport = require("../config/passport");
const loginRouter = express.Router();
const authController = require("../controllers/authController");
const validateLogin = require("../validators/loginValidator");
const { isAuth } = require("../public/utils/authMiddleware");

loginRouter.get("/", authController.getLoginPage);
loginRouter.post(
  "/",
  validateLogin,
  authController.validateLoginForm,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureMessage: true,
  }),
);

loginRouter.get("/log-out", isAuth, authController.logOut);

module.exports = loginRouter;
