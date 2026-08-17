const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/fileController");

const multer = require("multer");
const { isAuth } = require("../public/utils/authMiddleware");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
