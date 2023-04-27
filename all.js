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