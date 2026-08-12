const updateContentBtns = document.querySelectorAll(".update-content-name-btn");
const updateForm = document.getElementById("update-form");
const contentNameInput = document.getElementById("update-content-name");

updateContentBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateForm.action = `/${btn.dataset.type}/${btn.dataset.contentId}?_method=PATCH`;
    contentNameInput.value = btn.dataset.contentName;
  });
});

// Multiple submission handling
updateForm.addEventListener("submit", () => {
  const button = updateForm.querySelector('button[type="submit"]');
  button.disabled = true;
});
