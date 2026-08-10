const updateFolderBtns = document.querySelectorAll(".update-folder-btn");
const updateForm = document.getElementById("update-form");
const folderNameInput = document.getElementById("update-folder-name");

updateFolderBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateForm.action = `/folder/${btn.dataset.folderId}?_method=PATCH`;
    folderNameInput.value = btn.dataset.folderName;
  });
});

// Multiple submission handling
updateForm.addEventListener("submit", () => {
  const button = updateForm.querySelector('button[type="submit"]');
  button.disabled = true;
});
