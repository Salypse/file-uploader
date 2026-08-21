const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/fileController");

const multer = require("multer");
const { isAuth, loadUserFile } = require("../public/utils/authMiddleware");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.get("/:id", isAuth, loadUserFile, fileController.filePageGet);

fileRouter.post(
  "{/:id}",
  upload.array("uploadFiles"),
  fileController.newFilesPost,
);

fileRouter.get(
  "/download/:userId{/:folderId}/:fileName",
  isAuth,
  fileController.downloadFile,
);

fileRouter.delete("/:id", isAuth, fileController.deleteFile);

module.exports = fileRouter;
