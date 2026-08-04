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

  async updateFolder(req, res, next) {
    try {
      await prisma.folder.update({
        where: {},
        data: {},
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteFolder(req, res, next) {
    try {
      await prisma.folder.delete({
        where: {
          id: res.locals.folder.id,
        },
      });

      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
};
