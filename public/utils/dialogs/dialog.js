const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtns = document.querySelectorAll(".close-modal");

const modals = document.querySelectorAll(".modal");

// Stop Button presses while action is loading/completing
modals.forEach((modal) => {
  const closeBtn = modal.querySelector(".close-modal");
  const actionBtn = modal.querySelector(".modal-action-btn");

  const form = modal.querySelector("form");

  form.addEventListener("submit", () => {
    actionBtn.disabled = true;
    closeBtn.disabled = true;
  });
});

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
  const dialogErrors = dialog.querySelector("#errors-list");

  btn.addEventListener("click", () => {
    dialog.close();

    if (dialogErrors) {
      dialogErrors.remove();
    }
  });
});
