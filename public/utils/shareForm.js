const shareLink = document.getElementById("share-link");

function copyLink() {
  navigator.clipboard.writeText(shareLink.innerText.trim());

  // Add css validation
  alert("copied");
}
