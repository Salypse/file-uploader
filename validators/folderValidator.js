const { body } = require("express-validator");

const validateFolder = [
  body("contentName")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 255 })
    .withMessage("Name must be 255 characters or less"),
];

module.exports = validateFolder;
