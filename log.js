console.log("Running log.js");

const logArea = document.querySelector('.operation-log-list-area') || document.body;
logArea.classList.add('op-log-clean');

const logRows = document.querySelectorAll('.result-list:not(.contents-header-txt)');

logRows.forEach(row => {
    const opCell = row.querySelector('.operation-log-opration');
    const urlCell = row.querySelector('.operation-log-url');
    
    if (opCell && urlCell) {
        const originalLink = urlCell.querySelector('a');
        if (!originalLink) return;

        const opText = opCell.textContent.trim().replace('LMS:', '');
        const urlText = urlCell.textContent.trim();
        const urlHref = originalLink.href;
        
        let typeClass = 'bg-course';
        if (urlText.includes('material')) typeClass = 'bg-material';
        if (urlText.includes('report') || urlText.includes('test')) typeClass = 'bg-report';

        const idMatch = urlText.match(/id=([^&\s]+)/);
        const idLabel = idMatch ? ` (ID:${idMatch[1]})` : '';

        opCell.innerHTML = `
            <a href="${urlHref}" target="_blank" style="text-decoration: none; color: inherit;">
                <span class="action-badge ${typeClass}">${opText}</span>
                <span style="font-size: 0.9em; color: #1e88e5; text-decoration: underline;">${idLabel}</span>
            </a>
        `;
    }
});
