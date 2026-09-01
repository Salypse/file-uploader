const supabase = require("../config/supabase");
const { prisma } = require("../lib/prisma");
const { downloadFromStorage } = require("../public/utils/fileBrowserUtils");

module.exports = {
  async filePageGet(req, res, next) {
    res.render("file");
  },

  async newFilesPost(req, res, next) {
    try {
      for (const file of req.files) {
        // Upload file data to supabase
        const storageName = crypto.randomUUID();
        const { data, error } = await supabase.storage
          .from("files")
          .upload(
            `/${req.user.id}${req.params.id ? `/${req.params.id}` : ""}/${storageName}`,
            file.buffer,
          );

        if (error) {
          return next(error);
        }

        // Create file reference in db
        await prisma.file.create({
          data: {
            name: file.originalname,
            path: data.path,
            parentId: Number(req.params.id) || null,
            userId: req.user.id,
          },
        });
      }
    } catch (error) {
      return next(error);
    }
    res.redirect(req.get("referer") || "/");
  },

  async downloadFile(req, res, next) {
    try {
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

  async deleteFile(req, res, next) {
    try {
      // Db file reference
      const file = await prisma.file.delete({
        where: {
          id: Number(req.body.fileId),
          userId: req.user.id,
        },
      });

      // Subpase file
      const { data, error } = await supabase.storage
        .from("files")
        .remove(file.path);

      if (error) {
        return next(error);
      }

      res.redirect(file.parentId ? `/folder/${file.parentId}` : "/");
    } catch (error) {
      return next(error);
    }
  },
};
