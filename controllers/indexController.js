const { prisma } = require("../lib/prisma");

exports.indexGet = async (req, res, next) => {
  try {
    const folders = req.user
      ? await prisma.folder.findMany({
          where: { userId: req.user.id },
        })
      : [];

    const errors = req.session.errors || [];
    req.session.errors = [];

    res.render("index", {
      folders: folders,
      errors: errors,
    });
  } catch (error) {
    return next(error);
  }
};
