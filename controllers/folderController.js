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

  async updateFolderName(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        req.session.openDialog = "update-folder";
        req.session.updateFolder = {
          id: res.locals.folder.id,
          name: req.body.folderName,
        };

        return req.session.save((error) => {
          if (error) {
            return next(error);
          }

          return res.redirect("/");
        });
      }

      await prisma.folder.update({
        where: {
          id: res.locals.folder.id,
        },
        data: {
          name: req.body.folderName,
        },
      });
      res.redirect("/");
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
