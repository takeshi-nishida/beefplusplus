///////////////////////////////////////////////////////////////////////////////
// 不要な情報を非表示にする
///////////////////////////////////////////////////////////////////////////////

Array.from(document.querySelectorAll("span.bold-txt"))
    .filter(e => e.innerText.includes("公開期間"))
    .map(e => e.closest(".contents-detail"))
    .forEach(e => e.style.display = "none");

Array.from(document.querySelectorAll("div.bold-txt"))
    .filter(e => e.innerText.includes("資料タイトル"))
    .map(e => e.closest(".contents-list"))
    .forEach(e => e.style.display = "none");

document.querySelectorAll("div.material-type-file-name")
    .forEach(e => e.style.display = "none");

// TODO: 教材に「資料」がない場合、表のヘッダーを非表示にする（あるいはいつも非表示にする？）
