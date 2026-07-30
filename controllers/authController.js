const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

module.exports = {
  // Login Functions

  getLoginPage(req, res, next) {
    const failureMessages = req.session.messages || [];
    //Clear failure messages on each get request
    req.session.messages = [];

    res.render("login", { messages: failureMessages });
  },

  validateLoginForm(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", { errors: errors.array() });
    }

    next();
  },

  logOut(req, res, next) {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      res.redirect("/");
    });
  },

  // Sign Up Functions

  getSignUpPage(req, res, next) {
    res.render("sign-up");
  },

  async postSignUp(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
      res.redirect("/login");
    } catch (error) {
      return next(error);
    }
  },
};
