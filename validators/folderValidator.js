const { body } = require("express-validator");

const validateFolder = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isLength({ max: 255 })
    .withMessage("Folder name must be 255 characters or less"),
];

module.exports = validateFolder;
