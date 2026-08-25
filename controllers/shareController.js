const { prisma } = require("../lib/prisma");
const { convertSqlDate } = require("../public/utils/valueConversion");

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
};
