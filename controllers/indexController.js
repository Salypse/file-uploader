const { prisma } = require("../lib/prisma");
const { getContent } = require("../public/utils/fileBrowserUtils");

exports.indexGet = async (req, res, next) => {
  try {
    let content = [];
    const flashErrors = req.flash("error");

    if (req.user) {
      content = await getContent(null, req.user.id);
    }

    res.render("folder", {
      content: content,
      errors: flashErrors,
    });
  } catch (error) {
    return next(error);
  }
};
