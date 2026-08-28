const { prisma } = require("../lib/prisma");
const {
  convertSqlDate,
  convertBytes,
} = require("../public/utils/valueConversion");
const {
  getParentFolders,
  getContent,
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

  async sharePageGet(req, res, next) {
    try {
      // Get data from shared location
      const share = res.locals.share;
      const currentFolder = share.folderId
        ? await prisma.folder.findUnique({
            where: {
              id: share.folderId,
              userId: share.userId,
            },
          })
        : "";

      const content = await getContent(share.folderId, share.userId);

      res.render("shareFolder", {
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
      const share = res.locals.share;
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

  async shareFileGet(req, res, next) {
    const share = res.locals.share;
    const file = await prisma.file.findUnique({
      where: {
        id: Number(req.params.id),
        userId: share.userId,
      },
    });

    const { data, error } = await supabase.storage
      .from("files")
      .download(file.path);

    file.createdAt = convertSqlDate(file.createdAt);
    file.size = convertBytes(data.size);

    res.render("shareFile", {
      file: file,
      shareFolderId: share.folderId,
      token: share.token,
    });
  },
};
