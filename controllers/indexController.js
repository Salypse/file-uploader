const { prisma } = require("../lib/prisma");

exports.indexGet = async (req, res, next) => {
  try {
    let content = [];
    const flashErrors = req.flash("error");

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

    res.render("index", {
      content: content,
      errors: flashErrors,
    });
  } catch (error) {
    return next(error);
  }
};
