const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

module.exports = {
  async folderPageGet(req, res, next) {
    try {
      // Form error handling
      const errors = req.session.errors;
      const openDialog = req.session.openDialog;
      const updateFolder = req.session.updateFolder;

      delete req.session.errors;
      delete req.session.openDialog;
      delete req.session.updateFolder;

      //Get sub folders
      const folders = await prisma.folder.findMany({
        where: {
          parentId: Number(req.params.id),
        },
      });

      res.render("folder", {
        folders: folders,
        errors: errors,
        openDialog: openDialog,
        updateFolder: updateFolder,
      });
    } catch (error) {
      return next(error);
    }
  },

  async newFolderPost(req, res, next) {
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        req.session.openDialog = "new-folder";
        return req.session.save((error) => {
          if (error) {
            return next(error);
          }

          return res.redirect(req.get("referer") || "/");
        });
      }

      const folder = await prisma.folder.create({
        data: {
          name: req.body.folderName,
          userId: req.user.id,
          parentId: Number(req.params.id) || null,
        },
      });
      return res.redirect(`/folder/${folder.id}`);
    } catch (error) {
      return next(error);
    }
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

          return res.redirect(req.get("referer") || "/");
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
      res.redirect(req.get("referer") || "/");
    } catch (error) {
      return next(error);
    }
  },

  async deleteFolder(req, res, next) {
    try {
      await prisma.folder.deleteMany({
        where: {
          OR: [
            { id: res.locals.folder.id },
            { parentId: res.locals.folder.id },
          ],
        },
      });

      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
};
