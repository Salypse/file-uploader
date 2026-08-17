const { body } = require("express-validator");
const { prisma } = require("../lib/prisma");

const validateFolder = [
  body("contentName")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 255 })
    .withMessage("Name must be 255 characters or less")
    .custom(async (name, { req }) => {
      const existingFolder = await prisma.folder.findFirst({
        where: {
          name: name,
          parentId: Number(req.params.id) || null,
        },
      });

      if (existingFolder) {
        throw new Error("Folder already exists at this location.");
      }
    }),
];

module.exports = validateFolder;
