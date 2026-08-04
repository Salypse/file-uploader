const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtns = document.querySelectorAll(".close-modal");

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
