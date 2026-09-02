const { body, validationResult } = require("express-validator");

module.exports = {
  validateLogin: [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .bail()
      .normalizeEmail(),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ],

  validateLoginForm(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", { errors: errors.array() });
    }

    next();
  },
};
