const updateContentBtns = document.querySelectorAll(".update-name-btn");
const updateForm = document.getElementById("update-form");
const updateNameHeader = document.getElementById("update-name-header");
const contentNameInput = document.getElementById("update-name-input");

updateContentBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateNameHeader.textContent = `Rename ${btn.dataset.type[0].toUpperCase() + btn.dataset.type.slice(1)}`;
    updateForm.action = `/${btn.dataset.type}/${btn.dataset.contentId}?_method=PATCH`;
    contentNameInput.value = btn.dataset.contentName;
  });
});

// Multiple submission handling
updateForm.addEventListener("submit", () => {
  const button = updateForm.querySelector('button[type="submit"]');
  button.disabled = true;
});
