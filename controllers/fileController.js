const supabase = require("../config/supabase");
const { prisma } = require("../lib/prisma");

module.exports = {
  async newFilesPost(req, res, next) {
    for (const file of req.files) {
      try {
        const { data, error } = await supabase.storage
          .from("files")
          .upload(
            `/${req.user.id}${req.params.id ? `/${req.params.id}` : ""}/${file.originalname}`,
            file.buffer,
          );

        if (error) {
          return next(error);
        }

        //Create file reference in db
        await prisma.file.create({
          data: {
            name: file.originalname,
            path: data.path,
            parentId: Number(req.params.id) || null,
            userId: req.user.id,
          },
        });
      } catch (error) {
        return next(error);
      }
    }
    res.redirect(req.get("referer") || "/");
  },

  async downloadFile(req, res, next) {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .download(
          `${req.user.id}${req.params.folderId ? `/${req.params.folderId}` : ""}/${req.params.fileName}`,
        );

      if (error) {
        return next(error);
      }
      const buffer = Buffer.from(await data.arrayBuffer());

      res.set(
        "Content-Disposition",
        `attachment; filename="${req.params.fileName}"`,
      );
      res.set("Content-Type", data.type);

      res.send(buffer);
    } catch (error) {
      return next(error);
    }
  },

  async deleteFile(req, res, next) {
    try {
      // Subpase file
      const response = await supabase.storage
        .from("files")
        .remove(req.body.filePath);

      // Db file reference
      await prisma.file.delete({
        where: {
          id: Number(req.body.fileId),
          userId: req.user.id,
        },
      });

      res.redirect(req.get("referer") || "/");
    } catch (error) {
      return next(error);
    }
  },
};
