console.log("Running feedback.js");

chrome.storage.sync.get(optionNames, (items) => {
    if (items["show_submission_text_length"]) showSubmissionTextLength();
});

function showSubmissionTextLength() {
    const submissionText = document.getElementById("submissionText");
    if (submissionText) {
        const length = submissionText.textContent.length;
        submissionText.textContent += ` (${length}文字)`;
    }
}