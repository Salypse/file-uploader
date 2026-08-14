const { subscribe } = require("node:diagnostics_channel");
const supabase = require("../../config/supabase");
const { prisma } = require("../../lib/prisma");

async function deleteSupabaseRefs(folderId, userId) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
      userId: userId,
    },
    include: {
      folders: true,
      files: true,
    },
  });

  // If folder has sub folders call deleteFunction
  if (folder.folders && folder.folders.length > 0) {
    for (const subFolder of folder.folders) {
      await deleteSupabaseRefs(subFolder.id, userId);
    }
  }
  // Delete all file references in folder
  if (folder.files && folder.files.length > 0) {
    for (const file of folder.files) {
      await supabase.storage.from("files").remove(file.path);
    }
  }
}

module.exports = { deleteSupabaseRefs };
