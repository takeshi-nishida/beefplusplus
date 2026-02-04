// 1. 学生データの抽出
function getStudentList() {
    const rows = document.querySelectorAll('#participant_result_list .result-data');
    const students = [];

    rows.forEach(row => {
        const role = row.querySelector('.enroll-participant-role').textContent;
        // 「学生」かつ「履修者」であることを確認（教職員を除外）
        if (role.includes('学生') && role.includes('履修者')) {
            const id = row.querySelector('.enroll-participant-user-number').textContent.trim();
            const name = row.querySelector('.enroll-participant-name').textContent.trim();
            students.push({ id, name });
        }
    });
    return students;
}

// 2. シャッフルとグループ分け
function generateGroups(groupCount) {
    const students = getStudentList();
    // シャッフル
    for (let i = students.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [students[i], students[j]] = [students[j], students[i]];
    }

    const groups = Array.from({ length: groupCount }, () => []);
    students.forEach((student, index) => {
        groups[index % groupCount].push(student);
    });
    return groups;
}

// 3. CSVダウンロード機能
function downloadCSV(groups) {
    let csvContent = "\uFEFFGroup,Student ID,Name\n"; // UTF-8 BOM付き
    groups.forEach((group, i) => {
        group.forEach(s => {
            csvContent += `${i + 1},${s.id},${s.name}\n`;
        });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "groups.csv");
    link.click();
}

function injectGroupPanel() {
    const header = document.querySelector('#participant_result_list');
    const panel = document.createElement('div');
    panel.style = "display: block; background: #f8f9fa; color: #333; padding: 15px; margin-bottom: 20px; border: 1px solid #ddd;";
    panel.innerHTML = `
        <strong>ランダムグループ分け</strong> 
        グループ数: <input type="number" id="group_num" value="3" style="width: 50px; margin: 0 10px;">
        <button class="btn btn-inline btn-txt btn-color" id="btn_group">グループ分け実行 & CSV保存</button>
    `;
    header.parentNode.insertBefore(panel, header);

    document.getElementById('btn_group').addEventListener('click', (e) => {
        e.preventDefault();
        const num = parseInt(document.getElementById('group_num').value);
        if (num > 0) {
            const groups = generateGroups(num);
            downloadCSV(groups);
            alert(`${num} グループに分けました。CSVを保存します。`);
        }
    });
}

function shouldShowGroupPanel() {
    const pagingTxt = document.querySelector('.paging-txt');
    if (!pagingTxt) return false;

    const text = pagingTxt.textContent; // "29件中1〜29件を表示"
    // 数字だけを抽出 [29, 1, 29]
    const nums = text.match(/\d+/g).map(Number);

    if (nums && nums.length === 3) {
        const total = nums[0];
        const start = nums[1];
        const end = nums[2];

        // 「全件数」が「表示されている最後の番号」と同じなら、全メンバーがこの画面にいる
        return total === end;
    }
    return false;
}

if (shouldShowGroupPanel()) {
    injectGroupPanel();
} else {
    console.log("学生数が多すぎてページが分かれているため、グループ分け機能は無効です。");
}