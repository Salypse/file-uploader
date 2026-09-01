const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/fileController");

const multer = require("multer");
const { isAuth, loadUserFile } = require("../public/utils/authMiddleware");
const { validateUploadedFiles } = require("../validators/fileValidator");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.get("/:id", isAuth, loadUserFile, fileController.filePageGet);

fileRouter.post(
  "{/:id}",
  upload.array("uploadFiles"),
  validateUploadedFiles,
  fileController.newFilesPost,
);

fileRouter.get(
  "/download/:id",
  isAuth,
  loadUserFile,
  fileController.downloadFile,
);

fileRouter.delete("/:id", isAuth, fileController.deleteFile);

module.exports = fileRouter;
