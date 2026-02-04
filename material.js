console.log("Running material.js");

const rows = document.querySelectorAll('.result-list');
let viewedCount = 0;

if(rows.length > 0){

    rows.forEach(row => {
        row.classList.add('show-status');
        const dateDiv = Array.from(row.querySelectorAll('.material-status-list-open-date'))
                            .find(el => el.textContent.includes(':'));

        if (dateDiv) {
            viewedCount++;
            const viewDate = new Date(dateDiv.textContent.trim());
            const diffHours = (new Date() - viewDate) / (1000 * 60 * 60);

            if (diffHours < 24) {
                row.classList.add('status-recent'); // 24時間以内
            } else {
                row.classList.add('status-viewed'); // それ以前の既読
            }
        } else {
            row.classList.add('status-unviewed'); // 未読
        }

    });

    const materialTitle = Array.from(document.querySelectorAll('#materialsSearchResult .block-title-txt'))
                            .find(el => el.textContent.includes('閲覧状況'));

    const rate = ((viewedCount / rows.length) * 100).toFixed(1);

    if (materialTitle && !materialTitle.querySelector('.rate-badge')) {
        const badge = document.createElement('span');
        badge.className = 'rate-badge';
        badge.textContent = `${viewedCount} / ${rows.length} (${rate}%)`;
        materialTitle.appendChild(badge);
    }

}
