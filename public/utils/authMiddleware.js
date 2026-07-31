const { prisma } = require("../../lib/prisma");

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
};
