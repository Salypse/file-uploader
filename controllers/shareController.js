const { prisma } = require("../lib/prisma");
const { convertSqlDate } = require("../public/utils/valueConversion");
const {
  getParentFolders,
  getContent,
} = require("../public/utils/fileBrowserUtils");

module.exports = {
  shareFormGet(req, res, next) {
    res.render("shareForm", {
      folder: res.locals.folder || null,
      folderId: res.locals.folder ? res.locals.folder.id : null,
    });
  },

  async newSharePost(req, res, next) {
    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + Number(req.body.expiresChoice),
    );

    try {
      const share = await prisma.share.create({
        data: {
          userId: req.user.id,
          folderId: Number(req.body.folderId) || null,
          expiresAt: expirationDate,
          token: crypto.randomUUID(),
        },
      });

      const shareLink = `${req.protocol}://${req.get("host")}/share/${share.token}`;

      res.render("shareForm", {
        share: { link: shareLink, expires: convertSqlDate(share.expiresAt) },
        folderId: share.folderId,
      });
    } catch (error) {
      return next(error);
    }
  },

  async sharePageGet(req, res, next) {
    try {
      const share = await prisma.share.findUnique({
        where: { token: req.params.token },
      });

      // Verify theres a share and its not expired
      if (!share || share.expiresAt < new Date()) {
        const error = new Error("Share not found or expired.");
        error.status = 404;
        throw error;
      }

      // Get data from shared location
      const currentFolder = share.folderId
        ? await prisma.folder.findUnique({
            where: {
              id: share.folderId,
              userId: share.userId,
            },
          })
        : "";

      const content = await getContent(share.folderId, share.userId);

      res.render("share", {
        content: content,
        currentFolder: currentFolder,
        token: share.token,
      });
    } catch (error) {
      return next(error);
    }
  },

  async shareFolderGet(req, res, next) {
    try {
      const share = await prisma.share.findFirst({
        where: {
          token: req.params.token,
        },
      });

      if (!share) {
        const error = new Error("Share not found or expired.");
        error.status = 404;
        throw error;
      }

      // If shared from root check folder belongs to user that created share
      if (!share.folderId) {
        const folder = await prisma.folder.findUnique({
          where: {
            id: Number(req.params.id),
            userId: share.userId,
          },
        });

        if (!folder) {
          const error = new Error("Share not found or folder unavailable.");
          error.status = 404;
          throw error;
        }
      }

      // If shared from folder check folder is a child of shared folder
      else {
        const parentFolders = await getParentFolders(
          share.userId,
          Number(req.params.id),
        );

        if (!parentFolders.includes(share.folderId)) {
          const error = new Error("Share not found or folder unavailable.");
          error.status = 404;
          throw error;
        }
      }

      const content = await getContent(req.params.id, share.userId);
      const currentFolder = await prisma.folder.findUnique({
        where: {
          id: Number(req.params.id),
          userId: share.userId,
        },
      });

      res.render("shareFolder", {
        content: content,
        currentFolder: currentFolder,
        shareFolderId: share.folderId,
        token: share.token,
      });
    } catch (error) {
      return next(error);
    }
  },
};
