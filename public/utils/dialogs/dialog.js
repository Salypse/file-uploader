const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtns = document.querySelectorAll(".close-modal");

window.addEventListener("pageshow", (event) => {
  const navigation = performance.getEntriesByType("navigation")[0];

  if (navigation.type === "back_forward") {
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
