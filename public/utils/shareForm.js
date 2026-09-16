const shareLink = document.getElementById("share-link");
const copyButton = document.getElementById("link-copy-btn");

function copyLink() {
  navigator.clipboard.writeText(shareLink.value.trim());

  copyButton.textContent = "Copied!";

  //After 2 seconds revert button to copy
  setTimeout(() => {
    copyButton.textContent = "Copy Link";
  }, 2000);
}
