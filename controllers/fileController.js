const supabase = require("../config/supabase");
const { prisma } = require("../lib/prisma");

module.exports = {
  async newFilesPost(req, res, next) {
    for (const file of req.files) {
      try {
        const { data, error } = await supabase.storage
          .from("files")
          .upload(file.originalname, file.buffer);

        if (error) {
          return next(error);
        }

        //Create file reference in db
        await prisma.file.create({
          data: {
            name: file.originalname,
            path: data.path,
          },
        });
      } catch (error) {
        return next(error);
      }
    }
    res.redirect("/");
  },
};
