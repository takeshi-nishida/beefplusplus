console.log("Running course.js");

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

for (const [query, value] of Object.entries(defaultValues)) {
    const input = document.querySelector(query);
    if (input && !input.value) {
        input.value = value;
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

if (document.getElementById("fromDate")) {
    const selectFromPeriod = createSelectWithDefaultOption("〇限で指定");

    periods.forEach((period, index) => {
        const start = document.createElement("option");
        start.value = period.start;
        start.innerText = `${index+1}限開始`;
        selectFromPeriod.appendChild(start);
        const end = document.createElement("option");
        end.value = period.end;
        end.innerText = `${index+1}限終了`;
        selectFromPeriod.appendChild(end);
    });
    const selectToPeriod = selectFromPeriod.cloneNode(true);
    
    selectFromPeriod.addEventListener("change", (event) => {
        const [hour, time] = selectFromPeriod.value.split(":");
        document.getElementById("formHour").value = hour;
        document.getElementById("formTime").value = time;
    });
    
    selectToPeriod.addEventListener("change", (event) => {
        const [hour, time] = selectToPeriod.value.split(":");
        document.getElementById("toHour").value = hour;
        document.getElementById("toTime").value = time;
    });
    
    document.getElementById("minuitSelectFrom-button").after(selectFromPeriod);
    document.getElementById("minuitSelectTo-button").after(selectToPeriod);    
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

function setRadioValue(name, value) {
    const radios = document.getElementsByName(name);
    Array.from(radios).forEach(radio => { radio.checked = radio.value === value });
}

setRadioValue("mailSendFlag", "1");

///////////////////////////////////////////////////////////////////////////////
// メッセージで「問い合わせを完了する」をクリックするよう促す文面を自動挿入する
///////////////////////////////////////////////////////////////////////////////

const inquiryComment = document.querySelector("#inquiryComment");
if (inquiryComment) {
    inquiryComment.value = "\n\nこの回答で問い合わせいただいた内容が解決した場合は「問い合わせを完了する」ボタンを押していただけると助かります。";
}
