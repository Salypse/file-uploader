const deleteContentBtns = document.querySelectorAll(".delete-content-btn");

const deleteHeader = document.getElementById("delete-header");
const deleteMessage = document.getElementById("delete-message");
const deleteForm = document.getElementById("delete-form");

deleteContentBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    deleteHeader.textContent = `Delete ${btn.dataset.type[0].toUpperCase() + btn.dataset.type.slice(1)}`;
    deleteMessage.textContent = `${btn.dataset.contentName} will be deleted`;
    deleteForm.action = `/${btn.dataset.type}/${btn.dataset.contentId}?_method=DELETE`;
  });
});
