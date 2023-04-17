console.log("Running course.js");

///////////////////////////////////////////////////////////////////////////////
// 不要な情報を非表示にする
///////////////////////////////////////////////////////////////////////////////

Array.from(document.querySelectorAll("span.bold-txt"))
    .filter(e => e.innerText.includes("公開期間"))
    .map(e => e.closest(".contents-detail"))
    .forEach(e => e.style.display = "none");

document.querySelectorAll("div.material-type-file-name")
    .forEach(e => e.style.display = "none");

// TODO: 教材に「資料」がない場合、表のヘッダーを非表示にする（あるいはいつも非表示にする？）

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
// 公開期間の開始時刻を１～５限開始時刻に設定するボタンを追加する
///////////////////////////////////////////////////////////////////////////////

// TODO

///////////////////////////////////////////////////////////////////////////////
// お知らせの「メール・LINE通知設定」のデフォルトを「通知する」に設定する
///////////////////////////////////////////////////////////////////////////////

function setRadioValue(name, value) {
    const radios = document.getElementsByName(name);
    Array.from(radios).forEach(radio => { radio.checked = radio.value === value });
}

setRadioValue("mailSendFlag", "1");

///////////////////////////////////////////////////////////////////////////////
// お知らせを「メッセージ」が前にまとめて表示されるように並び替える
///////////////////////////////////////////////////////////////////////////////

const notifications = document.querySelector("#ctrl_menu_notification");

function sortList(ulElement) {
    Array.from(ulElement.children)
        .sort((a, b) => {
            const textA = a.textContent.trim();
            const textB = b.textContent.trim();
            const messageA = textA.includes('メッセージ');
            const messageB = textB.includes('メッセージ');
            return (messageB - messageA) || textA.localeCompare(textB);
        })
        .forEach(item => ulElement.appendChild(item));
}

if (notifications) sortList(notifications);

///////////////////////////////////////////////////////////////////////////////
// メッセージで「問い合わせを完了する」をクリックするよう促す文面を自動挿入する
///////////////////////////////////////////////////////////////////////////////

const inquiryComment = document.querySelector("#inquiryComment");
if (inquiryComment) {
    inquiryComment.value = "\n\nこの回答で問い合わせいただいた内容が解決した場合は「問い合わせを完了する」ボタンを押していただけると助かります。";
}
