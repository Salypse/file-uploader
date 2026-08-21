const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtns = document.querySelectorAll(".close-modal");

window.addEventListener("pageshow", (event) => {
  const navigation = performance.getEntriesByType("navigation")[0];

  if (navigation.type === "back_forward" || event.persisted) {
    window.location.reload();
  }
});

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.target).showModal();
  });
});

closeModalBtns.forEach((btn) => {
  const dialog = btn.closest("dialog");
  const dialogErrors = dialog.querySelector("#dialog-errors");

  btn.addEventListener("click", () => {
    dialog.close();

    if (dialogErrors) {
      dialogErrors.remove();
    }
  });
});
