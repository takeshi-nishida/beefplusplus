console.log("Running course.js");

chrome.storage.sync.get(optionNames, (items) => {
    if (items["set_default_datetimes"]) setDefaultDatetimes();
    if (items["use_coursetime_buttons"]) useCoursetimeButtons();
    if (items["notify_by_default"]) notifyByDefault();
    if (items["insert_clickcomplete_message"]) insertClickcompleteMessage();
    if (items["mailto"]) replaceStudentIDWithMailto();
    if (items["add_strong_warning"]) addStrongWarning();
});

///////////////////////////////////////////////////////////////////////////////
// 公開期間設定にデフォルト値を設定する
///////////////////////////////////////////////////////////////////////////////

const defaultValues = {
    "input#fromDate": getFormattedDate(),
    "input#formHour": "07",
    "input#formTime": "00",
    "input#toDate": "9999/12/31",
    "input#toHour": "23",
    "input#toTime": "59"
}

function setDefaultDatetimes() {
    for (const [query, value] of Object.entries(defaultValues)) {
        const input = document.querySelector(query);
        if (input && !input.value) {
            input.value = value;
        }
    }
}

function getFormattedDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

///////////////////////////////////////////////////////////////////////////////
// 公開期間の開始・終了時刻を授業時間に設定するボタンを追加する 
///////////////////////////////////////////////////////////////////////////////
const periods = [{ start: "08:50", end: "10:20" }, { start: "10:40", end: "12:10" }, { start: "13:20", end: "14:50" }, { start: "15:10", end: "16:40" }, { start: "17:00", end: "18:30" }];
const times = [ "00:00", "23:59" ];

function useCoursetimeButtons() {
    const fromButton = document.getElementById("minuitSelectFrom-button");
    if (fromButton) fromButton.after(createTimeShortcutSelect("formHour", "formTime"));

    const toButton = document.getElementById("minuitSelectTo-button");
    if (toButton) toButton.after(createTimeShortcutSelect("toHour", "toTime"));
}

function createTimeShortcutSelect(hourId, timeID) {
    const selectElement = createSelectWithDefaultOption("よく使う時間");
    periods.forEach((period, index) => {
        const start = document.createElement("option");
        start.value = period.start;
        start.innerText = `${index + 1}限開始`;
        selectElement.appendChild(start);
        const end = document.createElement("option");
        end.value = period.end;
        end.innerText = `${index + 1}限終了`;
        selectElement.appendChild(end);
    });
    times.forEach((time, index) => {
        const option = document.createElement("option");
        option.value = time;
        option.innerText = time;
        selectElement.appendChild(option);
    });
    selectElement.addEventListener("change", (event) => {
        const [hour, time] = selectElement.value.split(":");
        document.getElementById(hourId).value = hour;
        document.getElementById(timeID).value = time;
    });
    return selectElement;
}

function createSelectWithDefaultOption(defaultOptionText) {
    const selectElement = document.createElement('select');  
    const defaultOption = document.createElement('option');
    defaultOption.text = defaultOptionText;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.add(defaultOption);
    return selectElement;
}

///////////////////////////////////////////////////////////////////////////////
// お知らせの「メール・LINE通知設定」のデフォルトを「通知する」に設定する
///////////////////////////////////////////////////////////////////////////////

function notifyByDefault() {
    setRadioValue("mailSendFlag", "1");
}

function setRadioValue(name, value) {
    const radios = document.getElementsByName(name);
    Array.from(radios).forEach(radio => { radio.checked = radio.value === value });
}

///////////////////////////////////////////////////////////////////////////////
// メッセージで「問い合わせを完了する」をクリックするよう促す文面を自動挿入する
///////////////////////////////////////////////////////////////////////////////

function insertClickcompleteMessage() {
    const inquiryComment = document.querySelector("#inquiryComment");
    if (inquiryComment) {
        inquiryComment.value = "\n\nこの回答で問い合わせいただいた内容が解決した場合は「問い合わせを完了する」ボタンを押していただけると助かります。";
    }
}

///////////////////////////////////////////////////////////////////////////////
// 学籍番号を mailto: リンクにする
///////////////////////////////////////////////////////////////////////////////
const studentIdPattern = /\d{7}[A-Z]|\d{3}[A-Z]\d{3}[A-Z]|\d{3}[A-Z]{2}\d{2}[A-Z]/;
const ignoreNodeName = ["A", "SCRIPT", "STYLE"];

function replaceStudentIDWithMailto() {
    function replaceTextNode(textNode) {
        const studentIDMatches = textNode.nodeValue.match(studentIdPattern);
        if (studentIDMatches) {
            const parentNode = textNode.parentNode;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            for (const match of studentIDMatches) {
                const startIndex = textNode.nodeValue.indexOf(match, lastIndex);
                fragment.appendChild(document.createTextNode(textNode.nodeValue.substring(lastIndex, startIndex)));

                const email = `${match.toLowerCase()}@stu.kobe-u.ac.jp`;
                const link = document.createElement('a');
                link.href = `mailto:${email}`;
                link.appendChild(document.createTextNode(match));
                fragment.appendChild(link);

                lastIndex = startIndex + match.length;
            }
            fragment.appendChild(document.createTextNode(textNode.nodeValue.substring(lastIndex)));
            parentNode.replaceChild(fragment, textNode);
        }
    }

    function walk(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                if (!ignoreNodeName.includes(node.nodeName)) {
                    for (const childNode of node.childNodes) {
                        walk(childNode);
                    }
                }
                break;
            case Node.TEXT_NODE:
                replaceTextNode(node);
                break;
        }
    }

    walk(document.body);
}

///////////////////////////////////////////////////////////////////////////////
// 「登録する」押し忘れ防止
///////////////////////////////////////////////////////////////////////////////
function addStrongWarning() {
    const title = document.querySelector(".contents-title-txt");
    if (title.textContent.includes("登録確認")) {
        title.classList.add("strong-warning");
    }
}