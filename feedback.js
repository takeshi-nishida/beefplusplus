console.log("Running feedback.js");

chrome.storage.sync.get(optionNames, (items) => {
    if (items["show_submission_text_length"]) showSubmissionTextLength();
    if (items["adjacent_feedback_button"]) duplicateFeedbackButton();
    emphasizeLateSubmission();
});

function showSubmissionTextLength() {
    const submissionText = document.getElementById("submissionText");
    if (submissionText) {
        const length = submissionText.textContent.length;
        submissionText.insertAdjacentText("afterend", `（${length}文字）`);
    }
}

function duplicateFeedbackButton() {
    const buttons = document.querySelectorAll(".feedback-transition-btn");
    const nextButtons = Array.from(buttons).filter(b => b.textContent.includes("次"));
    const errMessage = document.getElementById("errmsg_score");
    if (errMessage) {
        const target = errMessage.parentElement;
        nextButtons.forEach(button => {
            const clone = button.cloneNode(true);
            target.insertBefore(clone, errMessage);    
        });
    }
}

function emphasizeLateSubmission() {
    const spans = document.querySelectorAll("span");
    spans.forEach(span => {
        if (span.textContent.includes("期限後提出")) {
            span.classList.add("bold-txt", "highlight-txt");
        }
    });
}