const { prisma } = require("../lib/prisma");

module.exports = {
  async validateUploadedFiles(req, res, next) {
    try {
      for (const file of req.files) {
        const existingFile = await prisma.file.findFirst({
          where: {
            name: file.originalname,
            parentId: Number(req.params.id),
            userId: req.user.id,
          },
        });

        if (existingFile) {
          req.flash("error", "File already exists at this location.");
          return req.session.save((error) => {
            if (error) {
              return next(error);
            }
            return res.redirect(req.get("referer") || "/");
          });
        }

        if (file.size > 50 * 1024 * 1024) {
          req.flash("error", "File size cannot be greater than 50mb.");
          return req.session.save((error) => {
            if (error) {
              return next(error);
            }
            return res.redirect(req.get("referer") || "/");
          });
        }
      }
    } catch (error) {
      return next(error);
    }

    return next();
  },
};
