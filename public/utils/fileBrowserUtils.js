const { prisma } = require("../../lib/prisma");
const supabase = require("../../config/supabase");

module.exports = {
  async getContent(parentId, userId) {
    const folders = await prisma.folder.findMany({
      where: {
        parentId: Number(parentId) || null,
        userId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const files = await prisma.file.findMany({
      where: {
        parentId: Number(parentId) || null,
        userId: userId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    // Merge folder and files, sort by createdAt value
    return {
      folders: folders,
      files: files,
      parentFolders: await module.exports.getParentFolders(
        userId,
        parentId,
        "folder",
      ),
    };
  },

  async getParentFolders(userId, itemId, type) {
    try {
      let parentFolders = [];
      let currentId = Number(itemId);

      while (currentId) {
        const item = await prisma[type].findUnique({
          where: {
            id: currentId,
            userId: userId,
          },
          include: { parentFolder: true },
        });

        if (!item || !item.parentFolder) {
          break;
        }
        parentFolders.push(item.parentFolder);
        currentId = item.parentFolder.id;
        // Change type to folder in case of starting type of file
        type = "folder";
      }

      return parentFolders.sort((a, b) => a.createdAt - b.createdAt);
    } catch (error) {
      throw error;
    }
  },

  async downloadFromStorage(file) {
    const { data, error } = await supabase.storage
      .from("files")
      .download(file.path);

    if (error) {
      throw error;
    }

    return data;
  },
};
