console.log("Javascript is connected");
// CURR. YEAR IN FOOTER
document.getElementById("year").textContent = new Date().getFullYear();

const title = document.getElementById("title");
const permalink = document.getElementById("permalink");

if (title && permalink) {
  title.addEventListener("input", function () {
    let title = this.value;
    let generatedPermalink = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    permalink.value = generatedPermalink;
  });

  document.getElementById("permalink").addEventListener("input", function () {
    let generatedPermalink = this.value;

    generatedPermalink = generatedPermalink
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Allow only lowercase, numbers, spaces, and hyphens
      .replace(/\s+/g, "-"); // Replace spaces with '-'

    this.value = generatedPermalink;
  });
}
