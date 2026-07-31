const express = require("express");
const folderRouter = express.Router();
const folderController = require("../controllers/folderController");
const { isAuth } = require("../public/utils/authMiddleware");
const validateFolder = require("../validators/folderValidator");

folderRouter.post("/", isAuth, validateFolder, folderController.newFolderPost);

module.exports = folderRouter;
