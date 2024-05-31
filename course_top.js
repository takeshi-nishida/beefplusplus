console.log("Running course_top.js");

chrome.storage.sync.get(optionNames, (items) => {
    if(items["hide_periods"]) hidePeriods();
    if(items["hide_tableheaders"]) hideTableheaders();
    if(items["hide_filenames"]) hideFilenames();
    if(items["title_tab"]) titleTab();
});

///////////////////////////////////////////////////////////////////////////////
// 不要な情報を非表示にする
///////////////////////////////////////////////////////////////////////////////

function hidePeriods() {
    Array.from(document.querySelectorAll("span.bold-txt"))
        .filter(e => e.innerText.includes("公開期間") && !e.innerText.includes("結果"))
        .map(e => e.closest(".contents-detail"))
        .forEach(e => e.style.display = "none");
}

function hideTableheaders() {
    Array.from(document.querySelectorAll("div.bold-txt"))
        .filter(e => e.innerText.includes("資料タイトル"))
        .map(e => e.closest(".contents-list"))
        .forEach(e => e.style.display = "none");
}

function hideFilenames() {
    document.querySelectorAll("div.material-type-file-name")
        .forEach(e => e.style.display = "none");
}

///////////////////////////////////////////////////////////////////////////////
// 表示を変更する
///////////////////////////////////////////////////////////////////////////////

function titleTab() {
    const titleElement = document.querySelector(".course-title-txt");
    if(titleElement){
        document.title = titleElement.textContent.replace(/[\r\n]/g, "").trim();
    }
}