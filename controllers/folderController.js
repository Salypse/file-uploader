const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");
const supabase = require("../config/supabase");
const { deleteSupabaseRefs } = require("../public/utils/deleteSupabaseRefs");

module.exports = {
  async folderPageGet(req, res, next) {
    try {
      // Get possible error info for dialogs
      const errors = req.session.errors;
      const openDialog = req.session.openDialog;
      const updateItem = req.session.updateItem;

      delete req.session.errors;
      delete req.session.openDialog;
      delete req.session.updateItem;

      const folders = await prisma.folder.findMany({
        where: {
          parentId: Number(req.params.id),
          userId: req.user.id,
        },
      });

      const files = await prisma.file.findMany({
        where: {
          parentId: Number(req.params.id),
          userId: req.user.id,
        },
      });

      // Merge folders and files with parentId of current folder
      const content = [
        ...folders.map((folder) => ({ ...folder, type: "folder" })),
        ...files.map((file) => ({ ...file, type: "file" })),
      ].sort((a, b) => a.createdAt - b.createdAt);

      res.render("folder", {
        content: content,
        errors: errors,
        openDialog: openDialog,
        updateItem: updateItem,
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
          name: req.body.contentName,
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
        req.session.openDialog = "update-name";
        req.session.updateItem = {
          id: res.locals.folder.id,
          name: req.body.contentName,
          type: "folder",
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
          name: req.body.contentName,
        },
      });
      res.redirect(req.get("referer") || "/");
    } catch (error) {
      return next(error);
    }
  },

  async deleteFolder(req, res, next) {
    try {
      // Delete supabase folder and its sub folders references
      await deleteSupabaseRefs(res.locals.folder.id, req.user.id);

      // Delete db folder reference (Cascade delete all children folders and files)
      await prisma.folder.delete({
        where: {
          id: res.locals.folder.id,
        },
      });

      res.redirect(
        res.locals.folder.parentId
          ? `/folder/${res.locals.folder.parentId}`
          : "/",
      );
    } catch (error) {
      return next(error);
    }
  },
};
