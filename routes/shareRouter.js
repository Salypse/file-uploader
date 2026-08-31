const express = require("express");
const shareRouter = express.Router();
const shareController = require("../controllers/shareController");
const {
  isAuth,
  loadUserFolder,
  verifyShareAccess,
} = require("../public/utils/authMiddleware");

shareRouter.get(
  "/create{/:id}",
  isAuth,
  (req, res, next) => {
    // If user is sharing from a folder load its data
    if (req.params.id) {
      return loadUserFolder(req, res, next);
    }
    next();
  },
  shareController.shareFormGet,
);

shareRouter.get(
  "/:token",
  verifyShareAccess("root"),
  shareController.sharePageGet,
);
shareRouter.get(
  "/:token/folder/:id",
  verifyShareAccess("folder"),
  shareController.shareFolderGet,
);
shareRouter.get(
  "/:token/file/:id",
  verifyShareAccess("file"),
  shareController.shareFileGet,
);

shareRouter.post("/", isAuth, shareController.newSharePost);

shareRouter.get(
  "/:token/download/:fileId",
  verifyShareAccess("file"),
  shareController.shareFileDownload,
);

module.exports = shareRouter;
