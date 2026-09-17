const express = require("express");
const passport = require("../config/passport");
const loginRouter = express.Router();
const authController = require("../controllers/authController");
const {
  validateLogin,
  validateLoginForm,
} = require("../validators/loginValidator");
const { isAuth } = require("../public/utils/authMiddleware");

loginRouter.get("/", authController.getLoginPage);
loginRouter.post(
  "/",
  validateLogin,
  validateLoginForm,
  passport.authenticate("local", {
    successRedirect: "/",
    failWithError: true,
    failureMessage: true,
  }),
);

// Save req.session.messages on passport error
loginRouter.use((err, req, res, next) => {
  if (err.status === 401) {
    return req.session.save((saveErr) => {
      if (saveErr) return next(saveErr);

      res.redirect("/login");
    });
  }
});

loginRouter.get("/log-out", isAuth, authController.logOut);

module.exports = loginRouter;
