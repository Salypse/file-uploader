const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/fileController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.post(
  "{/:id}",
  upload.array("uploadFiles"),
  fileController.newFilesPost,
);

module.exports = fileRouter;
