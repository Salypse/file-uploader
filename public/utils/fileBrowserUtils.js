const { prisma } = require("../../lib/prisma");
const supabase = require("../../config/supabase");

module.exports = {
  async getContent(parentId, userId) {
    const folders = await prisma.folder.findMany({
      where: {
        parentId: Number(parentId) || null,
        userId: userId,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        parentId: Number(parentId) || null,
        userId: userId,
      },
    });

    // Merge folder and files, sort by createdAt value
    const content = [
      ...folders.map((folder) => ({ ...folder, type: "folder" })),
      ...files.map((file) => ({ ...file, type: "file" })),
    ].sort((a, b) => a.createdAt - b.createdAt);
    return content;
  },

  async getParentFolders(userId, itemId, type) {
    try {
      let parentFolders = [];
      let currentId = itemId;

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
        parentFolders.push(item.parentFolder.id);
        currentId = item.parentFolder.id;
        // Change type to folder in case of starting type of file
        type = "folder";
      }

      return parentFolders;
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
