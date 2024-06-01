console.log("Running course_top.js");

chrome.storage.sync.get(optionNames, (items) => {
    if(items["format_periods"]) formatPeriods();
    if(items["hide_tableheaders"]) hideTableheaders();
    if(items["hide_filenames"]) hideFilenames();
    if(items["title_tab"]) titleTab();
    
    // コース編集画面の場合
    if(document.getElementById("course_edit")){
        if(items["promote_default_actions"]) promoteDefaultActions();        
    }

    adjustHeights();
});

///////////////////////////////////////////////////////////////////////////////
// 不要な情報を非表示にする
///////////////////////////////////////////////////////////////////////////////

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

function adjustHeights() {
    document.querySelectorAll(".block").forEach(b => {
        const title = b.querySelector(".block-title");
        const content = b.querySelector(".block-contents");
        content.style.height = "auto";
        title.style.height = content.offsetHeight + "px";
    });
}

///////////////////////////////////////////////////////////////////////////////
// 表示を変更する
///////////////////////////////////////////////////////////////////////////////

function formatPeriods() {
    Array.from(document.querySelectorAll("span.bold-txt"))
        .filter(e => e.innerText.includes("公開期間") && !e.innerText.includes("結果"))
        .map(e => e.closest(".contents-detail"))
        .forEach(formatPeriod);
}

function formatPeriod(e){
    const periodText = e.querySelector(".contents-input-area").textContent;
    const toDate = new Date(periodText.split("～")[1].trim());
    const remaining = remainingTime(toDate); // 残り時間[秒]

    // 残り時間が1年以上の場合は非表示、1週間以下の場合は強調表示
    if(remaining > 86400 * 365){
        e.style.display = "none";
    } else if(remaining < 86400 * 7){
        e.classList.add("highlight-txt");
    }
}

function titleTab() {
    const titleElement = document.querySelector(".course-title-txt");
    if(titleElement){
        document.title = titleElement.textContent.replace(/[\r\n]/g, "").trim();
    }
}

function promoteDefaultActions() {
    promoteDefaultActionsImpl("report", "course-edit-report-name");
    promoteDefaultActionsImpl("examination", "course-edit-examination-name");
    promoteDefaultActionsImpl("questionnaire", "course-edit-questionnaire-name");
    promoteDefaultActionsImpl("discussion", "course-edit-forum-title");
}

function promoteDefaultActionsImpl(id, className) {
    const block = document.getElementById(id);
    block.querySelectorAll("div.course-result-list").forEach(l => {
        const editAction = l.querySelector("a." + className);
        const defaultAction = l.querySelector("li.control-list > a").cloneNode(true);
        const wrapper = document.createElement("div");

        editAction.classList.remove(className);
        wrapper.classList.add(className);
        editAction.parentNode.insertBefore(wrapper, editAction);
        wrapper.appendChild(editAction);
        wrapper.appendChild(defaultAction);
        defaultAction.className = "";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "space-between";
    });
}