const deleteFolderBtns = document.querySelectorAll(".delete-folder-btn");

const deleteMessage = document.getElementById("delete-message");
const deleteForm = document.getElementById("delete-form");

deleteFolderBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    deleteMessage.textContent = `${btn.dataset.folderName} will be deleted`;
    deleteForm.action = `/folder/${btn.dataset.folderId}?_method=DELETE`;
  });
});
