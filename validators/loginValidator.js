const { body } = require("express-validator");

const validateLogin = [
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
];

module.exports = validateLogin;
