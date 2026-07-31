const express = require("express");
const folderRouter = express.Router();
const folderController = require("../controllers/folderController");
const { isAuth, loadUserFolder } = require("../public/utils/authMiddleware");
const validateFolder = require("../validators/folderValidator");

folderRouter.post("/", isAuth, validateFolder, folderController.newFolderPost);

folderRouter.get(
  "/:id",
  isAuth,
  loadUserFolder,
  folderController.folderPageGet,
);

module.exports = folderRouter;
