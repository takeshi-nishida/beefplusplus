console.log("Running course.js");

Array.from(document.querySelectorAll("span.bold-txt"))
    .filter(e => e.innerText.includes("公開期間"))
    .map(e => e.closest(".contents-detail"))
    .forEach(e => e.style.display = "none");

document.querySelectorAll("div.material-type-file-name")
    .forEach(e => e.style.display = "none");

document.querySelectorAll("div.contents-header-txt")
    .forEach(e => e.style.display = "none");