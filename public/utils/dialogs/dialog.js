const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtns = document.querySelectorAll(".close-modal");

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.target).showModal();
  });
});

closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest("dialog").close();
  });
});
