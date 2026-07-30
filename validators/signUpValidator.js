const { body } = require("express-validator");
const { prisma } = require("../lib/prisma");

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .bail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { username: value },
      });

      if (user) {
        throw new Error("Email is already registered");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at minimum 8 characters."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required.")
    .bail()
    // Only compare passwords once the password meets the requirements.
    .if((value, { req }) => req.body.password.length >= 8)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

module.exports = validateSignUp;
