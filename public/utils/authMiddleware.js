const supabase = require("../../config/supabase");
const { prisma } = require("../../lib/prisma");
const { convertBytes, convertSqlDate } = require("./valueConversion");

module.exports = {
  isAuth(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    next();
  },

  async loadUserFolder(req, res, next) {
    try {
      const folder = await prisma.folder.findFirst({
        where: {
          id: Number(req.params.id),
          userId: req.user.id,
        },
      });

      //Verify folder is made and owned by user
      if (!folder) {
        const error = new Error("Folder not Found.");
        error.status = 404;
        throw error;
      }

      res.locals.folder = folder;

      return next();
    } catch (error) {
      return next(error);
    }
  },

  async loadUserFile(req, res, next) {
    try {
      const file = await prisma.file.findFirst({
        where: {
          id: Number(req.params.id),
          userId: req.user.id,
        },
      });

      if (!file) {
        const error = new Error("File not Found.");
        error.status = 404;
        throw error;
      }

      const { data, error } = await supabase.storage
        .from("files")
        .download(file.path);

      if (error) {
        return next(error);
      }

      file.createdAt = convertSqlDate(file.createdAt);
      const fileSize = convertBytes(data.size);

      res.locals.file = { ...file, fileSize: fileSize };

      return next();
    } catch (error) {
      return next(error);
    }
  },
};
