///////////////////////////////////////////////////////////////////////////////
// お知らせを「メッセージ」が前にまとめて表示されるように並び替える
///////////////////////////////////////////////////////////////////////////////

chrome.storage.sync.get(optionNames, (items) => {
    if(items["sort_notifications"]) sortNotifications();
});

function sortNotifications() {
    const notifications = document.querySelector("#ctrl_menu_notification");
    if (notifications) sortList(notifications);    
}

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