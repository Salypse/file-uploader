const supabase = require("../../config/supabase");
const { prisma } = require("../../lib/prisma");
const { convertBytes, convertSqlDate } = require("./valueConversion");
const { getParentFolders } = require("./fileBrowserUtils");

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
          userId: res.locals.share ? res.locals.share.userId : req.user.id,
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

  verifyShareAccess(type) {
    return async (req, res, next) => {
      try {
        const share = await prisma.share.findFirst({
          where: {
            token: req.params.token,
          },
        });

        if (!share || share.expiresAt < new Date()) {
          const error = new Error("Share not found or expired.");
          error.status = 404;
          throw error;
        }

        // Folder or file access validation
        if (type !== "root") {
          // If shared from root
          if (!share.folderId) {
            const item = await prisma[type].findUnique({
              where: {
                id: Number(req.params.id) || Number(req.params.fileId),
                userId: share.userId,
              },
            });

            if (!item) {
              const error = new Error(
                "Share not found or content unavailable.",
              );
              error.status = 404;
              throw error;
            }
          }

          // If shared from folder
          else {
            const parentFolders = await getParentFolders(
              share.userId,
              Number(req.params.id) || Number(req.params.fileId),
              type,
            );

            if (!parentFolders.includes(share.folderId)) {
              const error = new Error(
                "Share not found or content unavailable.",
              );
              error.status = 404;
              throw error;
            }
          }
        }

        res.locals.share = share;
        next();
      } catch (error) {
        return next(error);
      }
    };
  },
};
