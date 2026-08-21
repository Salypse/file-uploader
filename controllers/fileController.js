const supabase = require("../config/supabase");
const { prisma } = require("../lib/prisma");

module.exports = {
  async filePageGet(req, res, next) {
    res.render("file");
  },

  async newFilesPost(req, res, next) {
    // Check uploaded files for errors before uploading all files
    for (const file of req.files) {
      // Local validation
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

    // Upload each file
    for (const file of req.files) {
      try {
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
      } catch (error) {
        return next(error);
      }
    }
    res.redirect(req.get("referer") || "/");
  },

  async downloadFile(req, res, next) {
    try {
      const filePath = `${req.user.id}${req.params.folderId ? `/${req.params.folderId}` : ""}/${req.params.fileName}`;
      // Verify File
      const file = await prisma.file.findFirst({
        where: {
          userId: req.user.id,
          parentId: Number(req.params.folderId) || null,
          path: filePath,
        },
      });

      if (!file) {
        req.flash("error", "Could not download file.");
        return req.session.save((error) => {
          if (error) {
            return next(error);
          }
          return res.redirect(req.get("referer") || "/");
        });
      }

      const { data, error } = await supabase.storage
        .from("files")
        .download(filePath);

      if (error) {
        return next(error);
      }

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
