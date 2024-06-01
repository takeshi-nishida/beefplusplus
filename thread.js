console.log("Running thread.js");

chrome.storage.sync.get(optionNames, (items) => {
    if(items["count_forum_messages"]) countForumMessages();
});

function countForumMessages() {
    const messages = document.querySelectorAll("div.discussion-message-block");
    const names = Array.from(messages)
        .map(m => m.querySelector("div.message-margin-top"))
        .map(d => d.querySelectorAll("span")[2].textContent);
    const uniqueNames = new Set(names);

    const p = document.createElement("p");
    p.textContent = `メッセージ数: ${messages.length}、参加者数: ${uniqueNames.size}`;
    messages[0].before(p);
}