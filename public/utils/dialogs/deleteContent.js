const deleteContentBtns = document.querySelectorAll(".delete-content-btn");

const deleteMessage = document.getElementById("delete-message");
const deleteForm = document.getElementById("delete-form");

deleteContentBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    deleteMessage.textContent = `${btn.dataset.contentName} will be deleted`;
    deleteForm.action = `/${btn.dataset.type}/${btn.dataset.contentId}?_method=DELETE`;
  });
});
