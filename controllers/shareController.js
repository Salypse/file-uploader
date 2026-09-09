const { prisma } = require("../lib/prisma");
const {
  convertSqlDate,
  convertBytes,
} = require("../public/utils/valueConversion");
const {
  getParentFolders,
  getContent,
  downloadFromStorage,
} = require("../public/utils/fileBrowserUtils");
const supabase = require("../config/supabase");

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

  async shareFolderGet(req, res, next) {
    try {
      const share = res.locals.share;
      const folderId = Number(req.params.id) || share.folderId;

      const content = await getContent(folderId, share.userId);
      const currentFolder = folderId
        ? await prisma.folder.findUnique({
            where: {
              id: folderId,
              userId: share.userId,
            },
          })
        : "";

      if (share.folderId) {
        // If shared from folder remove all parent folders above root folder

        const rootParents = await getParentFolders(
          share.userId,
          share.folderId,
          "folder",
        );
        content.parentFolders = content.parentFolders.filter(
          ({ id }) =>
            id !== share.folderId &&
            !rootParents.some((rootParent) => rootParent.id === id),
        );
      }

      res.render("shareFolder", {
        content: content,
        currentFolder: currentFolder,
        share: share,
      });
    } catch (error) {
      return next(error);
    }
  },

  async shareFileGet(req, res, next) {
    const share = res.locals.share;
    const file = res.locals.file;

    res.render("shareFile", {
      file: file,
      shareFolderId: share.folderId,
      token: share.token,
    });
  },

  async shareFileDownload(req, res, next) {
    try {
      const share = res.locals.share;
      const file = res.locals.file;

      const data = await downloadFromStorage(file);

      res.set("Content-Disposition", `attachment; filename="${file.name}"`);
      res.set("Content-Type", data.type);

      const buffer = Buffer.from(await data.arrayBuffer());
      res.send(buffer);
    } catch (error) {
      return next(error);
    }
  },
};
