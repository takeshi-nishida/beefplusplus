console.log("Running timetable.js");

document.querySelectorAll(".timetable-course-top-btn-mikaiko").forEach(e => {
    e.textContent += "(未公開)";

    let next = e.nextElementSibling;
    while(next) {
        next.style.display = "none";
        next = next.nextElementSibling;
    }
});