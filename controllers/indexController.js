const { prisma } = require("../lib/prisma");

exports.indexGet = async (req, res, next) => {
  try {
    let content = [];

    if (req.user) {
      const folders = await prisma.folder.findMany({
        where: {
          parentId: null,
          userId: req.user.id,
        },
      });

      const files = await prisma.file.findMany({
        where: {
          parentId: null,
          userId: req.user.id,
        },
      });

      // Merge folder and files, sort by createdAt value
      content = [
        ...folders.map((folder) => ({ ...folder, type: "folder" })),
        ...files.map((file) => ({ ...file, type: "file" })),
      ].sort((a, b) => a.createdAt - b.createdAt);
    }
    // Get possible error info for dialogs
    const errors = req.session.errors;
    const openDialog = req.session.openDialog;
    const updateFolder = req.session.updateFolder;

    delete req.session.errors;
    delete req.session.openDialog;
    delete req.session.updateFolder;

    res.render("index", {
      content: content,
      errors: errors,
      openDialog: openDialog,
      updateFolder: updateFolder,
    });
  } catch (error) {
    return next(error);
  }
};
