const fileInput = document.getElementById("upload-files");
const fileInputLabel = fileInput.nextElementSibling;

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;

  if (files.length === 0) return;

  fileInputLabel.textContent = `${files.length} File(s) Selected.`;
});
