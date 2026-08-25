const express = require("express");
const shareRouter = express.Router();
const shareController = require("../controllers/shareController");
const { isAuth, loadUserFolder } = require("../public/utils/authMiddleware");

shareRouter.get(
  "{/:id}",
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

shareRouter.post("/", isAuth, shareController.newSharePost);

module.exports = shareRouter;
