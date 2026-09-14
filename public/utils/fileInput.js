const fileInput = document.getElementById("upload-files");
const fileInputLabel = fileInput.nextElementSibling;

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;

  if (files.length === 0) return;

  if (files && files.length > 1) {
    fileInputLabel.textContent = `${files.length} files selected`;
  } else {
    fileInputLabel.textContent = files[0].name;
  }
});
