const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  async newFolderPost(req, res, next) {
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        return res.redirect("/");
      }

      const folder = await prisma.folder.create({
        data: {
          name: req.body.folderName,
          userId: req.user.id,
        },
      });
      return res.redirect(`/folder/${folder.id}`);
    } catch (error) {
      return next(error);
    }
  },

  async folderPageGet(req, res, next) {
    res.render("folder");
  },
};
