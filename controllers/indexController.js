const { prisma } = require("../lib/prisma");

exports.indexGet = async (req, res, next) => {
  try {
    const folders = req.user
      ? await prisma.folder.findMany({
          where: { userId: req.user.id, parentId: null },
        })
      : [];

    const errors = req.session.errors;
    const openDialog = req.session.openDialog;
    const updateFolder = req.session.updateFolder;

    delete req.session.errors;
    delete req.session.openDialog;
    delete req.session.updateFolder;

    res.render("index", {
      folders: folders,
      errors: errors,
      openDialog: openDialog,
      updateFolder: updateFolder,
    });
  } catch (error) {
    return next(error);
  }
};
