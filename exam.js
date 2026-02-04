console.log("Running exam.js");

const STORAGE_KEY = 'lms_grading_target_nums';
let targetQuestions = [];
let currentIdx = -1;


const panel = document.createElement('div');
panel.style = `
    position: fixed; top: 10px; right: 10px; z-index: 10000;
    width: 200px; padding: 12px; background: #fff;
    border: 2px solid #ff9800; border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-size: 13px;
`;
panel.innerHTML = `
    <div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #ff9800; display:flex; justify-content:space-between;">
        <span>採点ブースト</span>
    </div>
    
    <div style="margin-bottom:8px;">
        対象問題番号:
        <input type="text" id="target_input" placeholder="1, 3, 5" style="width:100%; margin-top:4px; border:1px solid #ccc; border-radius:3px; padding:2px;">
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
        <button id="btn_prev" style="padding:5px; cursor:pointer; font-size:12px;">
            <span style="border:1px solid #999; border-radius:3px; padding:0 3px; font-size:10px; background:#eee; box-shadow: 1px 1px 0 #bbb;">Alt</span> + <span style="border:1px solid #999; border-radius:3px; padding:0 4px; font-size:10px; background:#eee; box-shadow: 1px 1px 0 #bbb; font-weight:bold;">↑</span>
        </button>
        <button id="btn_next" style="padding:5px; cursor:pointer; font-size:12px;">
            <span style="border:1px solid #999; border-radius:3px; padding:0 3px; font-size:10px; background:#eee; box-shadow: 1px 1px 0 #bbb;">Alt</span> + <span style="border:1px solid #999; border-radius:3px; padding:0 4px; font-size:10px; background:#eee; box-shadow: 1px 1px 0 #bbb; font-weight:bold;">↓</span>
        </button>
    </div>

    <button id="btn_to_save" style="width:100%; margin-top:8px; background:#4caf50; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; font-weight:bold;">
        <span style="border:1px solid #fff; border-radius:3px; padding:0 3px; font-size:10px; background:rgba(255,255,255,0.2); box-shadow: 1px 1px 0 rgba(0,0,0,0.2);">Alt</span> + <span style="border:1px solid #fff; border-radius:3px; padding:0 4px; font-size:10px; background:rgba(255,255,255,0.2); box-shadow: 1px 1px 0 rgba(0,0,0,0.2); font-weight:bold;">→</span> 保存ボタン
    </button>
`;
document.body.appendChild(panel);

const input = document.getElementById('target_input');


function findQuestionElements() {
    const nums = input.value.split(',').map(n => n.trim()).filter(n => n !== "");
    targetQuestions = [];
    
    nums.forEach(num => {
        const hiddens = document.querySelectorAll(`input[name*=".examinationNo"][value="${num}"]`);
        hiddens.forEach(h => {
            const block = h.closest('.result-list') || h.parentElement; 
            targetQuestions.push(block);
        });
    });
}

function scrollToQuestion(idx) {
    if (targetQuestions.length === 0 || idx < 0 || idx >= targetQuestions.length) return;
    currentIdx = idx;
    
    targetQuestions[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 視覚的フィードバック（一瞬光らせる）
    const originalBG = targetQuestions[idx].style.backgroundColor;
    targetQuestions[idx].style.backgroundColor = '#fff9c4';
    targetQuestions[idx].style.outline = '3px solid #ff9800';
    setTimeout(() => {
        targetQuestions[idx].style.backgroundColor = originalBG;
        targetQuestions[idx].style.outline = 'none';
    }, 1500);
}

function scrollToSave() {
    const saveBtn = document.querySelector('.feedback-savemove-btn');
    if (saveBtn) {
        saveBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        saveBtn.style.outline = '4px solid #4caf50';
    }
}


input.addEventListener('input', () => {
    chrome.storage.sync.set({ [STORAGE_KEY]: input.value }, () => {
        findQuestionElements();
    });
});

document.getElementById('btn_next').addEventListener('click', () => {
    const nextIdx = (currentIdx + 1) % targetQuestions.length;
    scrollToQuestion(nextIdx);
});

document.getElementById('btn_prev').addEventListener('click', () => {
    const prevIdx = (currentIdx - 1 + targetQuestions.length) % targetQuestions.length;
    scrollToQuestion(prevIdx);
});

document.getElementById('btn_to_save').addEventListener('click', scrollToSave);


chrome.storage.sync.get([STORAGE_KEY], (res) => {
    if (res[STORAGE_KEY]) {
        input.value = res[STORAGE_KEY];
        // ページ読み込み完了を少し待ってから実行
        setTimeout(() => {
            findQuestionElements();
            if (targetQuestions.length > 0) {
                scrollToQuestion(0); // 最初のターゲットへ自動ジャンプ
            }
        }, 800);
    }
});

window.addEventListener('keydown', (e) => {
    if ((e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && !e.altKey) {
        return;
    }

    if (e.altKey && e.code === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % targetQuestions.length;
        scrollToQuestion(nextIdx);
    }

    if (e.altKey && e.code === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + targetQuestions.length) % targetQuestions.length;
        scrollToQuestion(prevIdx);
    }

    if (e.altKey && e.code === 'ArrowRight') {
        e.preventDefault();
        scrollToSave();
    }
});